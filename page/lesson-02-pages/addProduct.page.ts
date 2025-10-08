import { Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class AddNewProduct extends BasePage {
  productTitleInput= "#title";
  regularPriceInput= "#_regular_price";
  salePriceInput= "#_sale_price";
  publishButton= "#publish";
  messageLabel= "div#message p";

  constructor(page: Page) {
    super(page);
  }

  async addNewProduct(productname: string, regularprice: string, saleprice: string) {
    await this.page.locator(this.productTitleInput).fill(productname);
    await this.page.locator(this.regularPriceInput).fill(regularprice);
    await this.page.locator(this.salePriceInput).fill(saleprice);
    await this.page.locator(this.publishButton).click();
  }
}