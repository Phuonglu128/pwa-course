import { test, expect } from '@playwright/test';
import dataDev from './../lesson-01/config/data-dev.json';
import dataProd from './../lesson-01/config/data-dev.json';
import { LoginPage } from "../../page/login.page";
import { DashboardPage } from "../../page/dashboard.page";

let data: any;
let usernameValid: string, passwordValid: string;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  await test.step("Prepare data", async () => {
    data = process.env.ENV === 'prod' ? dataProd : dataDev;
    usernameValid = process.env.USERNAME || "";
    passwordValid = process.env.PASSWORD || "";
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToLoginPage();
  });
});

test.describe("Dashboard Authentication", () => {
  test("Login thành công", {
    annotation: {
      type: 'MODULE_ID',
      description: 'DB_AUTH'
    },
    tag: ['@DB_AUTH_001', '@DB_AUTH', '@UI', '@SMOKE']
  }, async ({ }) => {
    await test.step("Đăng nhập với thông tin username, password chính xác", async () => {
      await dashboardPage.login(usernameValid, passwordValid);

      await expect(dashboardPage.page.locator(dashboardPage.dashboardLink)).toBeVisible;
    })
  });

  test("Login thất bại", {
    annotation: {
      type: 'MODULE_ID',
      description: 'DB_AUTH'
    },
    tag: ['@DB_AUTH_002', '@DB_AUTH', '@UI', '@SMOKE']
  }, async ({ }) => {
    await test.step("Đăng nhập với thông tin username, password chính xác", async () => {
      await dashboardPage.login(data.login_page.data.username_invalid, data.login_page.data.password_invalid);

      await expect(loginPage.page.locator(dashboardPage.locatorError)).toContainText(
        `Error: The username ${data.login_page.data.username_invalid} is not registered on this site. If you are unsure of your username, try your email address instead.`
      );
    })
  })
});