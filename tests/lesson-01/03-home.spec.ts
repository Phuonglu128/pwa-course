import { test, expect } from '@playwright/test';


test('HOME_001', async ({ page }) => {
  console.log("BASE_URL is:", process.env.BASE_URL);
  await page.goto(process.env.BASE_URL!);
  await expect(page).toHaveTitle(/E-commerce/);
});
