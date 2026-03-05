import { expect, test } from "@playwright/test";

test.describe("Auth register page", () => {
  test("register page renders and has login link", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
    await expect(page.getByPlaceholder("Enter you full name")).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  test("register validation shows required field errors", async ({ page }) => {
    await page.goto("/register");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Date of Birth is required")).toBeVisible();
    await expect(
      page.getByText("Phone number can't be less than 10")
    ).toBeVisible();
    await expect(page.getByText("Please select your gender")).toBeVisible();
    await expect(page.getByText("Please select your blood group")).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
    await expect(
      page.getByText("Password should be atleast 6 characters")
    ).toBeVisible();
    await expect(page.getByText("Minimum 6 characters")).toBeVisible();
  });

  test("register validation shows password mismatch", async ({ page }) => {
    await page.goto("/register");

    await page.getByPlaceholder("Enter you full name").fill("Test User");
    await page.locator('input[type="date"]').fill("2000-01-01");
    await page.getByPlaceholder("98XXXXXXXX").fill("9812345678");
    await page.locator("select").first().selectOption("male");
    await page.getByPlaceholder("abc@email.com").fill("test@example.com");
    await page.locator('input[placeholder="••••••••"]').first().fill("password123");
    await page.locator('input[placeholder="••••••••"]').nth(1).fill("password999");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("password visibility toggle works on register password field", async ({ page }) => {
    await page.goto("/register");

    const passwordInput = page.locator('input[placeholder="••••••••"]').first();
    await expect(passwordInput).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("confirm password visibility toggle works", async ({ page }) => {
    await page.goto("/register");

    const confirmPasswordInput = page.locator('input[placeholder="••••••••"]').nth(1);
    await expect(confirmPasswordInput).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show confirm password" }).click();
    await expect(confirmPasswordInput).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Hide confirm password" }).click();
    await expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });
});
