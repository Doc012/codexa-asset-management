INSERT INTO assets (title, category, serial_number, acquisition_date, cost, location, condition, photo_path) VALUES
('Dell Laptop XPS 15', 'Electronics', 'DEL-XPS-001-2024', '2024-01-15', 1299.99, 'Office Building A, Floor 3', 'Good', '/photos/laptop_001.jpg'),
('Canon EOS R5 Camera', 'Photography', 'CAN-EOS-R5-001', '2023-06-20', 3799.50, 'Studio Room B', 'Excellent', '/photos/camera_001.jpg'),
('Standing Desk Pro', 'Furniture', 'STD-DESK-PRO-2024', '2024-03-10', 599.99, 'Office Building A, Floor 2', 'Good', '/photos/desk_001.jpg'),
('Thermal Imaging Camera', 'Equipment', 'FLIR-T540-2023', '2023-11-05', 5299.00, 'Warehouse C', 'Fair', '/photos/thermal_cam_001.jpg'),
('HP LaserJet Pro M404n Printer', 'Office Equipment', 'HP-LJ-404N-001', '2024-02-28', 449.99, 'Office Building A, Floor 1', 'Good', '/photos/printer_001.jpg'),
('4K Monitor LG 32UP550', 'Electronics', 'LG-32UP550-001', '2023-12-12', 699.99, 'Office Building A, Floor 3', 'Excellent', '/photos/monitor_001.jpg'),
('Conference Table Mahogany', 'Furniture', 'CONF-TABLE-001-2024', '2024-01-22', 2499.00, 'Meeting Room Suite B', 'Good', '/photos/conference_table_001.jpg');

INSERT INTO users (first_name, last_name, email, role, password, department, profile_picture_url) VALUES
('John', 'Smith', 'john.smith@company.com', 'ADMIN', 'hashed_password_001', 'IT Department', 'https://example.com/profiles/john_smith.jpg'),
('Sarah', 'Johnson', 'sarah.johnson@company.com', 'STAFF', 'hashed_password_002', 'Marketing', 'https://example.com/profiles/sarah_johnson.jpg'),
('Michael', 'Chen', 'michael.chen@company.com', 'STAFF', 'hashed_password_003', 'Finance', 'https://example.com/profiles/michael_chen.jpg'),
('Emily', 'Rodriguez', 'emily.rodriguez@company.com', 'MANAGER', 'hashed_password_004', 'Operations', 'https://example.com/profiles/emily_rodriguez.jpg'),
('David', 'Brown', 'david.brown@company.com', 'STAFF', 'hashed_password_005', 'Sales', 'https://example.com/profiles/david_brown.jpg'),
('Lisa', 'Anderson', 'lisa.anderson@company.com', 'STAFF', 'hashed_password_006', 'HR', 'https://example.com/profiles/lisa_anderson.jpg'),
('James', 'Wilson', 'james.wilson@company.com', 'MANAGER', 'hashed_password_007', 'IT Department', 'https://example.com/profiles/james_wilson.jpg');

INSERT INTO loans (user_id, asset_id, request_date, status, checkout_date, due_date, return_date) VALUES
(1, 1, '2026-05-20', 'APPROVED', '2026-05-22', '2026-06-22', NULL),
(2, 3, '2026-04-15', 'APPROVED', '2026-04-18', '2026-05-18', '2026-05-17'),
(3, 2, '2026-06-02', 'PENDING', NULL, NULL, NULL),
(1, 4, '2026-05-10', 'APPROVED', '2026-05-12', '2026-06-12', '2026-06-11'),
(4, 5, '2026-03-01', 'APPROVED', '2026-03-05', '2026-04-05', '2026-04-04'),
(2, 6, '2026-06-01', 'APPROVED', '2026-06-03', '2026-07-03', NULL),
(3, 7, '2026-05-25', 'REJECTED', NULL, NULL, NULL);

INSERT INTO audit_logs (user_id, entity_type, entity_id, action_type, timestamp, old_value, new_value) VALUES
(3, 'ASSET', 1, 'CREATE', '2026-06-01 08:00:00', 'NULL', 'Asset: Dell Laptop XPS 15 created'),
(4, 'ASSET', 2, 'UPDATE', '2026-06-02 09:15:00', 'condition: Good', 'condition: Excellent'),
(5, 'LOAN', 1, 'CREATE', '2026-06-02 10:30:00', 'NULL', 'Loan created for user 3'),
(3, 'LOAN', 1, 'CHECK_OUT', '2026-05-22 11:00:00', 'status: PENDING', 'status: APPROVED'),
(4, 'LOAN', 2, 'CHECK_OUT', '2026-04-18 14:20:00', 'status: PENDING', 'status: APPROVED'),
(6, 'ASSET', 5, 'UPDATE', '2026-06-03 13:45:00', 'location: Warehouse C', 'location: Office Building A'),
(5, 'LOAN', 3, 'CHECK_IN', '2026-06-04 15:30:00', 'status: APPROVED', 'status: COMPLETED');

-- Update asset photos with actual image URLs
UPDATE assets SET photo_path = 'https://www.laptopsatcost.co.za/wp-content/uploads/2022/09/dell-xps-9510.png.webp' WHERE title = 'Dell Laptop XPS 15';
UPDATE assets SET photo_path = 'https://www.fotodiscountworld.co.za/wp-content/uploads/2022/12/canon-r5-kit.jpg' WHERE title = 'Canon EOS R5 Camera';
UPDATE assets SET photo_path = 'https://oakywood.shop/cdn/shop/files/standingdeskpro-walnutveneer-black-02-szare.jpg?crop=center&height=450&v=1720004032&width=600' WHERE title = 'Standing Desk Pro';
UPDATE assets SET photo_path = 'https://www.gothermal.co.za/cdn/shop/products/FLIR_E96_720x.jpg?v=1646145377' WHERE title = 'Thermal Imaging Camera';
UPDATE assets SET photo_path = 'https://www.mfpgroup.co.za/images/cmsimages/big/product-297-44-elegantecompatta.jpg' WHERE title = 'HP LaserJet Pro M404n Printer';
UPDATE assets SET photo_path = 'https://www.pbtech.co.nz/fileslib/_20220831125902_080.png' WHERE title = '4K Monitor LG 32UP550';
UPDATE assets SET photo_path = 'https://creativeofficefurniture.co.za/wp-content/uploads/2024/11/BR00120Barrel20Boardroom20table20dark.jpg' WHERE title = 'Conference Table Mahogany';
