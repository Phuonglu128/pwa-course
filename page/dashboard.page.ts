import { Page } from "@playwright/test";
import { BasePage } from "../page/base.page";

export class DashboardPage extends BasePage {
  loginLink = 'a[href*="/my-account/"]';
  usernameInput = '#username';
  passwordInput = '#password';
  loginButton = 'button[class*="login__submit"]';
  dashboardLink = 'nav[class="woocommerce-MyAccount-navigation"] li[class*="dashboard"]';
  locatorError = "ul.woocommerce-error li";

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    await this.page.locator(this.loginLink).click();
    await this.page.locator(this.usernameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
  }
}