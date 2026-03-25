# Inventory Management System - PostgreSQL & Sequelize

Dự án đã được chuyển đổi từ MongoDB/Mongoose sang PostgreSQL/Sequelize.

## Chạy dự án
1. Cài đặt PostgreSQL trên máy của bạn.
2. Tạo database: `CREATE DATABASE inventory_db;`
3. Cập nhật file `.env`:
   - `DB_HOST`: localhost
   - `DB_USER`: postgres
   - `DB_PASS`: 123456
   - `DB_NAME`: inventory_db
   - `DB_PORT`: 5432
4. Cài đặt phụ thuộc: `npm install`
5. Chạy server: `npm start`
   - Sequelize sẽ tự động tạo bảng (table) và quan hệ nếu chưa tồn tại (`sync { alter: true }`).

## Các API Endpoints (Port 3000)

### 1. Sản phẩm (Product)
- **POST `/api/product`**: Tạo sản phẩm mới.
  - Body (JSON): `{ "name": "Bàn phím cơ", "price": 1200000, "description": "RGB Blue Switch" }`
  - *Khi tạo Product, Inventory sẽ tự động được tạo qua Sequelize hook.*
- **GET `/api/product`**: Lấy danh sách sản phẩm.

### 2. Kho hàng (Inventory)
- **GET `/api/inventory`**: Lấy toàn bộ thông tin kho (đã kèm thông tin Product).
- **POST `/api/inventory/add-stock`**: Nhập thêm hàng.
  - Body: `{ "product": "UUID_CỦA_PRODUCT", "quantity": 100 }`
- **POST `/api/inventory/remove-stock`**: Xuất kho.
  - Body: `{ "product": "UUID_CỦA_PRODUCT", "quantity": 10 }`
- **POST `/api/inventory/reserve`**: Đặt hàng (Giảm stock, tăng reserved).
  - Body: `{ "product": "UUID_CỦA_PRODUCT", "quantity": 5 }`
- **POST `/api/inventory/sold`**: Hoàn tất bán hàng (Giảm reserved, tăng soldCount).
  - Body: `{ "product": "UUID_CỦA_PRODUCT", "quantity": 5 }`

---

## Hướng dẫn sử dụng Postman (Đơn giản)

1. **Import Collection**:
   - Mở Postman -> Chọn `Import` -> Chọn file `PostmanCollection.json` trong thư mục dự án.
2. **Quy trình test**:
   - **Bước 1**: Chạy request `Create Product`. Copy giá trị `id` trong kết quả trả về.
   - **Bước 2**: Thay thế `REPLACE_WITH_PRODUCT_ID` trong Body của các request khác bằng cái `id` vừa copy.
   - **Bước 3**: Chạy các request `Add Stock`, `Reserve`, `Sold` và xem sự thay đổi dữ liệu trong `Get All Inventories`.

---

## Phân tích & Ưu điểm sau khi đổi sang PostgreSQL
- **Transactions**: Các API `reserve` và `sold` hiện đã sử dụng Sequelize Transactions để đảm bảo tính nhất quán (Nếu trừ stock lỗi thì không tăng reserved).
- **Hooks**: Sử dụng `afterCreate` hook để đảm bảo Product luôn đi kèm Inventory.
- **Relational Integrity**: Sử dụng Foreign Keys (`productId`) giúp quản lý quan hệ dữ liệu chặt chẽ hơn so với NoSQL.
