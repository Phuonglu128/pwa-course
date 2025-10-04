# Playwright Testing Knowledge Overview

## Cài đặt thư viện

npm install -D <tên thư viện>, -D (--save-dev)

## Khởi tạo project

npm init playwright@latest
npm init playwright@latest <folder-name>

## Sửa config mặc định cho project

worker = 1
retries = 1
trace = ‘on’
keep only 1 project - chromium

## Playwright basic syntax

page.locator(“”).action(data)
page.action(locator, data);

expect().non-retrying
await expect(element).auto-retrying

## Tương tác với phần tử

● Navigate: page.goto(url)
● Text Input, Textarea: page.fill(selector, value)
● Radio Button & Checkbox: page.check(selector) /
page.uncheck(selector)
● Button: page.click(selector)
● Focus: page.focus(selector)
● Hover: page.hover(selector)
● Drag and Drop: page.dragAndDrop(source, target)
● Upload Files: page.setInputFiles(selector, filePath)
● Iframe: page.frameLocator(selector).locator(childSelector)

## Test suite

test.describe (Dùng để gom nhóm test cases thành một test suite)
test (Dùng để định nghĩa 1 TC)
test.step (Chia nhỏ 1 test thành các steps)

## Hooks

○ beforeAll: Chạy 1 lần trước cả suite.
○ beforeEach: Chạy trước mỗi test.
○ afterEach: Chạy sau mỗi test.
○ afterAll: Chạy 1 lần sau cả suite.

## Biến môi trường

Tại sao cần biến môi trường?

- Giúp tách biệt các cấu hình khác nhau cho dev / staging / prod.

- Không hard-code URL, credentials vào trong code.

- Dễ dàng switch môi trường khi chạy test.

npm install -D dotenv
import dotenv from 'dotenv';
dotenv.config();

## Annotations & Tags

- Annotation: Các đánh dấu đặc biệt được thêm vào code để cung cấp thông tin bổ sung hoặc kiểm soát hành vi của các test case
- Tag là các nhãn được gắn vào test case để phân loại và nhóm các test case theo các tiêu chí nhất định.

● test.skip: đánh dấu 1 test là bỏ qua (chưa cần fix)

test.skip("Assert number of product", async ({ page }) => {
// test content
});

● Conditional skip: chỉ skip nếu đạt điều kiện

test("Assert number of product ", async ({ page, browserName }) => {
test.skip(browserName === 'chromium', "Chưa hỗ trợ chạy trên chromium");
});

● test.fixme: đánh dấu 1 test là bỏ qua (cần fix nhưng
chưa có thời gian, đánh dấu để test không fail nữa)

test.fixme("Assert number of product", async ({ page }) => {
// test content
});

● Tạo thêm 1 object nữa trong function test:
○ type: loại annotation
○ description: mô tả
Annotation sẽ được hiểnthị trong report

● Annotation with slow

test('slow test', async ({ page }) => {
  test.slow(); // đánh dấu test chạy chậm
  await page.goto('url');
});

## Emulation

Devices: test.use({ ...devices['iPhone 12'] })

Viewport: test.use({ viewport: { width: 1280, height: 720 } })

Locale & Timezone: test.use({ locale: 'fr-FR', timezoneId: 'Europe/Paris' })

Permissions: test.use({ permissions: ['geolocation'] })

## Clock

Clock API giúp thay đổi hành vi mặc định của đồng hồ, phục vụ
cho các test cần “chờ”
Một số function sẽ sử dụng:
● setFixedTime()
● install
● fastForward
● pauseAt
● runFor

setFixedTime - Đặt thời gian cố định

await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
● Mục đích: Đặt Date.now() thành giá trị cố định
● Khi nào dùng: Khi chỉ cần fake thời gian hiện tại
● Ví dụ: Test banner chỉ hiện vào giờ nhất định

install() - Khởi tạo clock

await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
● Mục đích: Bắt đầu kiểm soát hoàn toàn thời gian và timer
● Lưu ý: PHẢI gọi trước tất cả function khác
● Override: setTimeout, setInterval, Date, performance, v.v.

fastForward() - Tua nhanh

await page.clock.fastForward('05:00'); // 5 phút
await page.clock.fastForward(5000); // 5 giây
● Mục đích: Nhảy ngay đến thời điểm tương lai
● Khi nào dùng: Test timeout, countdown, session expiry
● Lợi ích: Không cần đợi thời gian thực

pauseAt() - Tạm dừng tại thời điểm từ chưa biết gì

await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
● Mục đích: Dừng thời gian tại điểm cụ thể
● Khi nào dùng: Khi cần kiểm tra trạng thái ở thời điểm chính xác

runFor() - Tick “thủ công”

await page.clock.runFor(2000); // Tick 2 giây
● Mục đích: Điều khiển từng mili giây, kích hoạt timer từng bước
● Khi nào dùng: Cần kiểm soát rất chi tiết quá trình

await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.clock.fastForward(5000); // tua nhanh 5s
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
await page.clock.runFor(2000); // tick thủ công 2s

## Accessibility Testing

● Accessibility = khả năng truy cập
● Accessibility testing = test khả năng truy cập

Học automation test Tại sao cần Accessibility testing từ chưa biết gì

● Tuân thủ pháp lý: Tránh kiện tụng
● Cải thiện UX: Làm web thân thiện hơn cho tất cả
người dùng.
● Tăng phạm vi tiếp cận: Hỗ trợ người dùng với công
nghệ hỗ trợ (screen readers, keyboard navigation).
● Tích hợp sớm: Phát hiện lỗi sớm trong CI/CD để tiết
kiệm chi phí sửa chữa.

Học automation test Accessibility testing với Playwright từ chưa biết gì

Accessibility testing đảm bảo
website dễ sử dụng cho mọi người,
bao gồm người khuyết tật.
Playwright tích hợp với axe-core
để phát hiện tự động các vấn đề
accessibility theo tiêu chuẩn
WCAG (Web Content Accessibility
Guidelines).
Axe-core có thể phát hiện khoảng
57% các vấn đề accessibility, còn
lại cần test manual.

Học automation test Các vấn đề phổ biến axe-core kiểm tra từ chưa biết gì

● Độ tương phản màu (Contrast): Văn bản không đủ
tương phản với nền (ví dụ: chữ xám nhạt trên nền
trắng).
● Labels cho trình đọc màn hình: Input thiếu label hoặc
aria-label.
● ID trùng lặp: Phần tử có ID giống nhau gây nhầm lẫn
cho assistive tech.
● Alt text cho image: Hình ảnh thiếu alt attribute mô tả.
● Keyboard navigation: Element không focusable bằng
bàn phím.
● ARIA attributes: Sử dụng sai ARIA roles, states.

Học automation test Accessibility testing từ chưa biết gì

Cài đặt thư viện:
npm install -D @axe-core/playwright