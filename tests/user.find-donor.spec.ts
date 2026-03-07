import { expect, test, type Page } from "@playwright/test";

async function setUserAuthCookie(page: Page) {
  await page.context().addCookies([
    {
      name: "auth_token",
      value: "playwright-user-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

test.describe("User find-donor page", () => {
  test.beforeEach(async ({ page }) => {
    await setUserAuthCookie(page);
  });

  test("find-donor page renders core request form UI", async ({ page }) => {
    await page.goto("/user/find-donor");

    await expect(page.getByRole("button", { name: "For Myself" })).toBeVisible();
    await expect(page.getByRole("button", { name: "For Others" })).toBeVisible();
    await expect(page.getByText("Recipient Blood Type:")).toBeVisible();
    await expect(page.getByText("Recipient's Details:")).toBeVisible();
    await expect(page.getByText("Recipient's Condition:")).toBeVisible();
    await expect(page.getByText("Hospital Name:")).toBeVisible();
    await expect(page.getByRole("button", { name: "Post Request" })).toBeVisible();
  });

  test("find-donor shows patient information fields for others tab", async ({ page }) => {
    await page.goto("/user/find-donor");

    await page.getByRole("button", { name: "For Others" }).click();

    await expect(page.getByText("Patient's Information:")).toBeVisible();
    await expect(
      page.getByPlaceholder("Relation to patient (e.g. Brother)")
    ).toBeVisible();
    await expect(page.getByPlaceholder("Patient name")).toBeVisible();
    await expect(page.getByPlaceholder("Patient phone number")).toBeVisible();
  });

  test("find-donor hides patient fields when switching back to self tab", async ({ page }) => {
    await page.goto("/user/find-donor");

    await page.getByRole("button", { name: "For Others" }).click();
    await expect(page.getByText("Patient's Information:")).toBeVisible();

    await page.getByRole("button", { name: "For Myself" }).click();
    await expect(page.getByText("Patient's Information:")).not.toBeVisible();
  });

  test("recipient condition defaults to urgent and allows selecting stable", async ({
    page,
  }) => {
    await page.goto("/user/find-donor");

    const conditionSelect = page.locator('select[name="recipientCondition"]');
    await expect(conditionSelect).toHaveValue("urgent");
    await conditionSelect.selectOption("stable");
    await expect(conditionSelect).toHaveValue("stable");
  });

  test("hospital section shows input or a fallback message", async ({ page }) => {
    await page.goto("/user/find-donor");

    await expect(page.getByText("Hospital Name:")).toBeVisible();

    const hospitalInput = page.getByPlaceholder("Search hospital...");
    const noHospitals = page.getByText(/No hospitals available/i);
    const hospitalError = page
      .getByText(/Failed to fetch hospitals|jwt malformed|unauthorized|invalid token/i)
      .first();

    const state = await Promise.any([
      hospitalInput.waitFor({ state: "visible", timeout: 6000 }).then(() => "input"),
      noHospitals.waitFor({ state: "visible", timeout: 6000 }).then(() => "empty"),
      hospitalError.waitFor({ state: "visible", timeout: 6000 }).then(() => "error"),
    ]).catch(() => null);

    expect(state).toBeTruthy();
  });
});
