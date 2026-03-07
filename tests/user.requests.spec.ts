import { expect, test, type Page } from "@playwright/test";

const REQUESTS_ERROR_TEXT =
  /Failed to load requests|Fetch pending requests failed|jwt malformed|invalid token|unauthorized/i;

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

async function waitForRequestsState(page: Page): Promise<"loaded" | "error" | null> {
  const allRequestsTab = page.getByRole("button", { name: "All Requests" });
  const requestsError = page.getByText(REQUESTS_ERROR_TEXT);

  return Promise.any([
    allRequestsTab.waitFor({ state: "visible", timeout: 6000 }).then(() => "loaded" as const),
    requestsError.waitFor({ state: "visible", timeout: 6000 }).then(() => "error" as const),
  ]).catch(() => null);
}

async function expectRequestsErrorState(page: Page) {
  await expect(page.getByText(REQUESTS_ERROR_TEXT)).toBeVisible();
}

test.describe("User requests page", () => {
  test.beforeEach(async ({ page }) => {
    await setUserAuthCookie(page);
  });

  test("requests page renders user header navigation", async ({ page }) => {
    await page.goto("/user/requests");
    await page.waitForLoadState("networkidle");

    const nav = page.getByLabel("Global");
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Find Donor" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Requests" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Logout" })).toBeVisible();
  });

  test("requests page renders tabs and search or an auth/api error state", async ({
    page,
  }) => {
    await page.goto("/user/requests");

    if ((await waitForRequestsState(page)) === "loaded") {
      await expect(page.getByRole("button", { name: "Matched" })).toBeVisible();
      await expect(page.getByRole("button", { name: "All Requests" })).toBeVisible();
      await expect(
        page.getByPlaceholder("Search by blood group, hospital, patient...")
      ).toBeVisible();
    } else {
      await expectRequestsErrorState(page);
    }
  });

  test("matched-tab query route stays stable", async ({ page }) => {
    await page.goto("/user/requests?tab=matched&km=10&page=1");
    await expect(page).toHaveURL(/tab=matched/);

    if ((await waitForRequestsState(page)) === "loaded") {
      await expect(page.getByRole("button", { name: "Matched" })).toBeVisible();
    } else {
      await expectRequestsErrorState(page);
    }
  });

  test("search query route stays stable", async ({ page }) => {
    await page.goto("/user/requests?tab=all&search=test&page=1");
    await expect(page).toHaveURL(/search=test/);

    if ((await waitForRequestsState(page)) === "loaded") {
      await expect(
        page.getByPlaceholder("Search by blood group, hospital, patient...")
      ).toHaveValue("test");
    } else {
      await expectRequestsErrorState(page);
    }
  });

  test("requests page footer contact is visible", async ({ page }) => {
    await page.goto("/user/requests");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Contact Us")).toBeVisible();
    await expect(page.getByRole("link", { name: "support@bloodlink.com" })).toBeVisible();
  });
});
