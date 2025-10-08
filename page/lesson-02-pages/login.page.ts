import { Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class LoginPage extends BasePage {
  baseUrl = process.env.BASE_URL_02 || "";
  userNameInput= "#user_login";
  passwordInput= "#user_pass";
  loginButton= "#wp-submit";

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    await this.page.goto(this.baseUrl);
    await this.page.locator(this.userNameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
  }
}