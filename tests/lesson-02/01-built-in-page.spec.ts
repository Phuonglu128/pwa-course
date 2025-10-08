import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page/lesson-02-pages/login.page';
import dataDev from './../lesson-02/data/data-dev.json';
import dataProd from './../lesson-02/data/data-dev.json';
import { AddNewProduct } from '../../page/lesson-02-pages/addProduct.page';

test('PRODUCT_001 - Create product successfully using page fixture', async ({ page }) => {
  let data: any;
  let usernameValid: string, passwordValid: string;
  let loginPage: LoginPage;
  let newProduct: AddNewProduct;

  data = process.env.ENV === 'prod' ? dataProd : dataDev;
  usernameValid = process.env.USERNAME_INPUT || "";
  passwordValid = process.env.PASSWORD_INPUT || "";
  loginPage = new LoginPage(page);
  await loginPage.login(usernameValid, passwordValid);
  newProduct = new AddNewProduct(page);
  await newProduct.addNewProduct(data.add_new_product_page.data.product_name, data.add_new_product_page.data.regular_price, data.add_new_product_page.data.sale_price);
  await expect(newProduct.page.locator(newProduct.messageLabel).first()).toContainText(data.add_new_product_page.expected.heading, { timeout: 15000 });
});
