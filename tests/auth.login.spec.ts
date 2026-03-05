import { expect, test } from "@playwright/test";

test.describe("Auth login page", () => {
  test("login page renders and has register link", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByPlaceholder("abc@email.com")).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  test("forgot password link points to forgot-password route", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });

  test("login validation shows errors for invalid inputs", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid email address")).toBeVisible();
    await expect(
      page.getByText("Password should be atleast 6 characters")
    ).toBeVisible();
  });

  test("password visibility toggle works on login form", async ({ page }) => {
    await page.goto("/login");

    const passwordInput = page.getByPlaceholder("••••••••");
    await expect(passwordInput).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("remember me checkbox can be toggled", async ({ page }) => {
    await page.goto("/login");

    const rememberMe = page.getByRole("checkbox", { name: "Remember Me" });
    await expect(rememberMe).not.toBeChecked();

    await rememberMe.check();
    await expect(rememberMe).toBeChecked();
  });
});
