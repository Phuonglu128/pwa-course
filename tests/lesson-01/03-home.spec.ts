import { test, expect } from '@playwright/test';
import dataDev from './../lesson-01/config/data-dev.json';
import dataProd from './../lesson-01/config/data-dev.json';
import { LoginPage } from "../../page/login.page";


let data: any;
let homePage: LoginPage;

test.describe("HOME", () => {
  test.beforeEach(async ({ page }) => {
    data = process.env.ENV === 'prod' ? dataProd : dataDev;
    homePage = new LoginPage(page);
    await homePage.navigateToLoginPage();
  });

  test("Kiểm tra home page hiển thị", {
    annotation: {
      type: 'MODULE_ID',
      description: 'HOME'
    },
    tag: ["@HOME_001", "@HOME", "@UI"],
  }, async ({ }) => {
    await test.step("1. Kiểm tra title trang web", async () => {
      await expect(homePage.page).toHaveTitle(data.home_page.expected.title);
    });

    await test.step("2. Kiểm tra heading trang web", async () => {
      await expect(homePage.page.locator(homePage.locatorHeading)).toHaveText(data.home_page.expected.heading);
    });

    await test.step("3. Kiểm tra số lượng sản phẩm trang web", async () => {
      expect(await homePage.page.locator(homePage.locatorResultCount).textContent()).toContain(data.home_page.expected.quantity);
    });
  });
});