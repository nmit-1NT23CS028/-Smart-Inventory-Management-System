USE sims;

-- Password hashes are bcrypt of: Admin@123 / Manager@123 / Staff@123 (rounds=10)
INSERT INTO users (name,email,password_hash,role) VALUES
('Admin User','admin@sims.local','$2b$10$3Q9YyZ1jVbq0Q8m1V7c9c.uG2YwS0Hh3JZ0gWQk0F7M1uG3i5xK9C','admin'),
('Manager User','manager@sims.local','$2b$10$3Q9YyZ1jVbq0Q8m1V7c9c.uG2YwS0Hh3JZ0gWQk0F7M1uG3i5xK9C','manager'),
('Staff User','staff@sims.local','$2b$10$3Q9YyZ1jVbq0Q8m1V7c9c.uG2YwS0Hh3JZ0gWQk0F7M1uG3i5xK9C','staff');
-- NOTE: Seeded hash is a placeholder. Run `npm run seed` in backend to insert real bcrypt hashes.

INSERT INTO categories (name,description) VALUES
('Electronics','Phones, laptops, accessories'),
('Apparel','Clothing & footwear'),
('Groceries','Food & household');

INSERT INTO suppliers (name,email,phone,address) VALUES
('Acme Distributors','sales@acme.com','+1-555-0100','123 Market St'),
('Global Traders','hello@globaltraders.com','+1-555-0200','45 Trade Plaza');

INSERT INTO products (sku,barcode,name,description,category_id,supplier_id,cost_price,sell_price,stock_qty,reorder_level) VALUES
('SKU-001','8901234500011','Wireless Mouse','Ergonomic wireless mouse',1,1,8.50,19.99,120,10),
('SKU-002','8901234500028','USB-C Cable 1m','Braided USB-C cable',1,1,2.00,7.99,4,10),
('SKU-003','8901234500035','Cotton T-Shirt','Unisex round-neck tee',2,2,4.00,14.99,60,15),
('SKU-004','8901234500042','Coffee Beans 1kg','Arabica medium roast',3,2,9.00,22.50,2,8);
