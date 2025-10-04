import { test, expect } from '@playwright/test';

test.describe('Dashboard Authentication', () => {
  let loginLink, usernameInput, passwordInput, loginButton, dashboardLink;

  test.beforeEach(async ({ page, context }) => {
    loginLink = page.locator('a[href*="/my-account/"]');
    usernameInput = page.locator('#username');
    passwordInput = page.locator('#password');
    loginButton = page.locator('button[class*="login__submit"]');
    dashboardLink = page.locator('nav[class="woocommerce-MyAccount-navigation"] li[class*="dashboard"]');
  });

  test('DASHBOARD_AUTH_001 - login with valid credentials for dev env', async ({ page }) => {
    await page.goto(process.env.BASE_URL!);
    await loginLink.click();
    await usernameInput.fill(process.env.USERNAME_INPUT!);
    await passwordInput.fill(process.env.PASSWORD_INPUT!);
    await loginButton.click();
    await expect(dashboardLink).toBeVisible({ timeout: 30000 });
  });

    test('DASHBOARD_AUTH_002 - login with valid credentials for prod env', async ({ page }) => {
    await page.goto(process.env.BASE_URL!);
    await loginLink.click();
    await usernameInput.fill(process.env.USERNAME!);
    await passwordInput.fill(process.env.PASSWORD!);
    await loginButton.click();
    await expect(dashboardLink).toBeVisible({ timeout: 10000 });
  });
});