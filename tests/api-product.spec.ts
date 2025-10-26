import { expect } from '@playwright/test';
import { test } from '../fixtures/db-fixture';

test('API & DB - Create, Update, Verify and Cleanup Product (PWA102)', async ({ request, db }) => {

  // Step 1: Setup - Tạo mới category và product
  const baseUrl = process.env.BASE_URL;
  const categoryRes = await request.post(`${baseUrl}/category/create.php`, {
    data: JSON.stringify({
      name: 'PWA102 Category',
      description: 'Category for PWA102',
    }),
  });
  const categoryBody = await categoryRes.json();
  const categoryId = categoryBody.category.id;
  console.log(`Category created: ${categoryId}`);

  const productRes = await request.post(`${baseUrl}/product/create.php`, {
    data: JSON.stringify({
      name: 'Initial Product',
      price: 1000,
      category_id: categoryId,
    }),
  });
  const productBody = await productRes.json();
  const productId = productBody.product.id;
  console.log(`Product created: ${productId}`);

  // Step 2: Update sản phẩm
  const updateRes = await request.post(`${baseUrl}/product/update.php`, {
    data: JSON.stringify({
      id: productId,
      name: 'PWA102 product',
      price: 3000,
    }),
  });

  const updateBody = await updateRes.json();
  console.log('Update Response:', updateBody);
  expect(updateBody.success).toBeTruthy();

  // Step 3: Verify trong database
  const result = await db.query('SELECT * FROM product WHERE id = ?', [productId]);
  const updatedProduct = result[0];
  console.log('Data from DB:', updatedProduct);

  expect(updatedProduct.name).toEqual('PWA102 product');
  expect(Number(updatedProduct.price)).toBe(3000);

  // Step 4: Teardown - Xoá dữ liệu đã tạo
  await db.query('DELETE FROM product WHERE id = ?', [productId]);
  await db.query('DELETE FROM category WHERE id = ?', [categoryId]);
  console.log('Deleted product and category.');
});