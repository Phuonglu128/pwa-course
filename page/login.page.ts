import { Page } from "@playwright/test";
import { BasePage } from "../page/base.page";

export class LoginPage extends BasePage {
  baseUrl = process.env.BASE_URL || "";
  locatorHeading = "//p[@class='site-title']/a";
  locatorResultCount = "//p[@class='woocommerce-result-count']";

  constructor(page: Page) {
    super(page);
  }

  async navigateToLoginPage() {
    await this.page.goto(this.baseUrl);
  }
}