import { test, expect } from '@playwright/test';

test('WebSocket Echo Testing', async ({ page }) => {

  await test.step('Go to WebSocket test page and verify connection', async () => {
    await page.goto('https://echo.websocket.org/.ws');

    const info = page.locator('.info').nth(1);
    await expect(info).toHaveText('connected');
  });

  await test.step('Send message and verify received message', async () => {
    const message = 'Hello from PWA102';
    await page.fill('#content', message);
    await page.getByRole('button', { name: /send/i }).click();
    const sendInfo = page.locator('.send').nth(0);
    const recvInfo = page.locator('.recv').nth(1);
    await expect(sendInfo).toHaveText(message);
    await expect(recvInfo).toHaveText(message);
  });

  await test.step('Disconnect from server and verify log', async () => {
    await page.click('button:has-text("Disconnect from server")');
    const disconnectedInfo = page.locator('.info').last();
    await expect(disconnectedInfo).toHaveText('disconnected');
  });
});