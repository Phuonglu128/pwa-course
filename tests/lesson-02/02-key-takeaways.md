# 🧩 Playwright Fixtures

## 📚 MỤC LỤC

1. [Fixture là gì? (Built-in Fixture)](#1️⃣-fixture-là-gì-built-in-fixture)
2. [Fixture Overriding (Ghi đè Fixture)](#2️⃣-fixture-overriding-ghi-đè-fixture)
3. [Fixture: Scope (Phạm vi)](#3️⃣-fixture-scope-phạm-vi)
4. [Fixture: Timeout (Giới hạn thời gian setup)](#4️⃣-fixture-timeout-giới-hạn-thời-gian-setup)
5. [Fixture: Custom Title (Tên hiển thị)](#5️⃣-fixture-custom-title-tên-hiển-thị)
6. [Fixture: Execution Order (Thứ tự thực thi)](#6️⃣-fixture-execution-order-thứ-tự-thực-thi)
7. [Fixture Box Option (Thuộc tính tùy chọn)](#📦-fixture-box-option)

---

## 1️⃣ Fixture là gì? (Built-in Fixture)

**Fixture** là “đối tượng hỗ trợ” mà Playwright **tự động tạo trước khi test chạy**,  
giúp bạn làm việc dễ dàng hơn mà không phải tự khởi tạo như `browser`, `context`, `page`, `request`, v.v.

### 🧠 Ví dụ:

```ts
import { test, expect } from '@playwright/test';

test('Built-in fixture example', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
````

📦 Ở đây:

* `page` là **built-in fixture**.
* Nó được tạo ra nhờ `browser` và `context`.
* Playwright **tự đóng browser** sau khi test kết thúc.

---

## 2️⃣ Fixture Overriding (Ghi đè Fixture)

Bạn có thể **ghi đè fixture mặc định** để thay đổi hành vi — ví dụ:
tự động mở URL trước khi mỗi test chạy.

```ts
import { test as base, expect } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('https://example.com');
    await use(page);
  },
});

test('Fixture overriding example', async ({ page }) => {
  await expect(page).toHaveURL('https://example.com/');
});
```

🔹 `extend()` giúp bạn tạo phiên bản test có fixture tùy chỉnh riêng cho file này.

---

## 3️⃣ Fixture: Scope (Phạm vi)

`scope` xác định **khi nào fixture được tạo và huỷ**.

| Scope    | Mô tả                            | Ứng dụng                         |
| :------- | :------------------------------- | :------------------------------- |
| `test`   | Tạo và huỷ cho **mỗi test case** | Dữ liệu riêng biệt cho từng test |
| `worker` | Tạo 1 lần per worker             | Dùng chung giữa nhiều test       |

```ts
import { test as base } from '@playwright/test';

const test = base.extend({
  dbConnection: [
    async ({}, use) => {
      console.log('🔌 Kết nối database');
      await use({ connected: true });
      console.log('❌ Đóng kết nối database');
    },
    { scope: 'worker' }, // chỉ tạo 1 lần per worker
  ],
});

test('Scope demo', async ({ dbConnection }) => {
  console.log(dbConnection);
});
```

---

## 4️⃣ Fixture: Timeout (Giới hạn thời gian setup)

Dùng `timeout` để tránh fixture bị treo khi setup quá lâu.

```ts
import { test as base } from '@playwright/test';

const test = base.extend({
  slowFixture: [
    async ({}, use) => {
      await new Promise(r => setTimeout(r, 3000)); // mô phỏng chậm
      await use('done');
    },
    { timeout: 2000 }, // ❌ lỗi vì quá 2s
  ],
});

test('Fixture timeout example', async ({ slowFixture }) => {
  console.log(slowFixture);
});
```

---

## 5️⃣ Fixture: Custom Title (Tên hiển thị)

Dùng khi muốn hiển thị **tên tùy chỉnh** của fixture trong report hoặc log.

```ts
import { test as base } from '@playwright/test';

const test = base.extend({
  dbFixture: [
    async ({}, use) => {
      await use('DB Connected');
    },
    { title: '🧩 Database Fixture' },
  ],
});

test('Custom title example', async ({ dbFixture }) => {
  console.log(dbFixture);
});
```

---

## 6️⃣ Fixture: Execution Order (Thứ tự thực thi)

### ⚙️ Quy tắc:

* **Dependencies:** Fixture A phụ thuộc B → B setup trước, teardown sau A.
* **Lazy Execution:** Non-auto fixtures chỉ setup khi test/hook gọi tới.
* **Automatic Fixtures:** `{ auto: true }` → luôn setup, dù test không gọi.
* **Scope:** Worker-scoped setup trước, teardown sau tất cả test.
* **Hooks:**

  * `beforeAll` / `afterAll`: chạy 1 lần per worker.
  * `beforeEach` / `afterEach`: chạy mỗi test.
* **Teardown:** Chạy **ngược thứ tự setup**.

### 🧩 Ví dụ:

```ts
import { test as base } from '@playwright/test';

const test = base.extend({
  workerFixture: [async ({}, use) => {
    console.log('1️⃣ workerFixture setup');
    await use();
    console.log('6️⃣ workerFixture teardown');
  }, { scope: 'worker' }],

  testFixture: async ({ workerFixture }, use) => {
    console.log('2️⃣ testFixture setup');
    await use();
    console.log('5️⃣ testFixture teardown');
  },
});

test.beforeEach(async () => console.log('3️⃣ beforeEach hook'));
test.afterEach(async () => console.log('4️⃣ afterEach hook'));

test('Execution order example', async () => {
  console.log('➡️ Test running...');
});
```

📋 **Kết quả console:**

```
1️⃣ workerFixture setup
3️⃣ beforeEach hook
2️⃣ testFixture setup
➡️ Test running...
5️⃣ testFixture teardown
4️⃣ afterEach hook
6️⃣ workerFixture teardown
```

---

## 📦 Fixture Box Option

| Option    | Mô tả                                            | Ví dụ                           |
| :-------- | :----------------------------------------------- | :------------------------------ |
| `scope`   | Xác định vòng đời fixture (`test` hoặc `worker`) | `{ scope: 'worker' }`           |
| `auto`    | Tự động setup dù không gọi                       | `{ auto: true }`                |
| `timeout` | Giới hạn thời gian setup                         | `{ timeout: 3000 }`             |
| `title`   | Tên hiển thị trong report                        | `{ title: 'Database Fixture' }` |

---

## ✅ Tổng kết nhanh

| Khái niệm       | Mô tả ngắn                                    |
| :-------------- | :-------------------------------------------- |
| Fixture         | Dữ liệu hoặc đối tượng setup sẵn để test dùng |
| Overriding      | Ghi đè fixture mặc định để thay đổi hành vi   |
| Scope           | Xác định vòng đời (test / worker)             |
| Timeout         | Giới hạn thời gian setup                      |
| Custom Title    | Đặt tên hiển thị trong log                    |
| Execution Order | Quy tắc setup & teardown giữa các fixture     |

---

## ⚖️ So sánh tổng quan giữa **POM** và **Fixture**

| Tiêu chí                           | **POM (Page Object Model)**                                        | **Fixture**                                                                          |
| :--------------------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| 🎯 **Mục đích chính**              | Tổ chức **hành vi & thao tác của trang web** (UI actions)          | Tổ chức **dữ liệu, môi trường & dependency** (test setup)                            |
| 🧩 **Đối tượng quản lý**           | Mỗi **class** đại diện cho **1 trang (Page)** hoặc **1 component** | Mỗi **fixture** đại diện cho **1 tài nguyên (browser, data, API client, config...)** |
| 🧠 **Tư duy chính**                | “Tôi muốn mô phỏng người dùng thao tác trên UI”                    | “Tôi muốn chuẩn bị môi trường trước khi test chạy”                                   |
| 🔄 **Phạm vi tái sử dụng**         | Dùng lại giữa nhiều test khác nhau (qua class)                     | Dùng lại giữa nhiều test khác nhau (qua injection)                                   |
| ⚙️ **Tạo và hủy (setup/teardown)** | Do bạn **gọi thủ công** (khởi tạo class, mở trang, click, v.v.)    | Do Playwright **quản lý tự động** (setup, teardown, timeout, scope)                  |
| 📦 **Cấu trúc code**               | Nằm trong folder `pages/` (VD: `LoginPage.ts`)                     | Nằm trong file test hoặc `fixtures.ts`                                               |
| 🧰 **Cách dùng trong test**        | Gọi method của page object                                         | Nhận fixture thông qua destructuring `{ fixtureName }`                               |
| 💬 **Ví dụ thực tế**               | `loginPage.login(username, password)`                              | `await apiClient.get('/users')`                                                      |

---

## 🔍 Ví dụ minh họa: cùng 1 test — dùng **POM** vs **Fixture**

### 🧱 Cách 1 — Dùng **POM**

```ts
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page) {}

  async goto() {
    await this.page.goto('https://demo.playwright.dev');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('button[type=submit]');
  }
}
```

```ts
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Login with POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('admin', '123456');
  await expect(page).toHaveURL(/dashboard/);
});
```

🧩 **Điểm chính:**

* `LoginPage` chứa logic UI.
* Test gọi method để **mô phỏng thao tác người dùng**.

---

### ⚙️ Cách 2 — Dùng **Fixture**

```ts
// fixtures/customFixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  loginData: async ({}, use) => {
    await use({ username: 'admin', password: '123456' });
  },

  apiClient: async ({}, use) => {
    const api = { get: (url) => `GET request to ${url}` };
    await use(api);
  },
});
```

```ts
// tests/login.fixture.spec.ts
import { test, expect } from '../fixtures/customFixtures';

test('Login with Fixture', async ({ page, loginData }) => {
  await page.goto('https://demo.playwright.dev');
  await page.fill('#username', loginData.username);
  await page.fill('#password', loginData.password);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/dashboard/);
});
```

🧩 **Điểm chính:**

* Fixture cung cấp **dữ liệu sẵn sàng** (`loginData`) hoặc **API, context, config**, v.v.
* Không mô tả thao tác UI, mà lo phần **chuẩn bị môi trường**.

---

## 💡 Tóm tắt dễ nhớ

| Khi nào dùng                                        | Dùng **POM** | Dùng **Fixture** |
| :-------------------------------------------------- | :----------- | :--------------- |
| Cần thao tác UI trên trang                          | ✅            | ❌                |
| Cần setup/teardown tài nguyên (API, DB, context...) | ❌            | ✅                |
| Muốn chia tách hành vi UI                           | ✅            | ❌                |
| Muốn chia sẻ dữ liệu, token, config giữa các test   | ❌            | ✅                |

---

## 🧠 Kết hợp cả hai (Best Practice)

Trong framework chuyên nghiệp, **POM và Fixture thường kết hợp**:

```ts
// fixtures/testBase.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

```ts
// tests/fullFlow.spec.ts
import { test, expect } from '../fixtures/testBase';

test('Full flow using both POM + Fixture', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('admin', '123456');
  await expect(loginPage.page).toHaveURL(/dashboard/);
});
```

💬 → Fixture tạo `LoginPage` (POM), POM xử lý hành vi UI.
=> Code test ngắn, dễ đọc, tách biệt rõ **logic UI** và **setup môi trường**.

---