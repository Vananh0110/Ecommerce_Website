-- Tạo bảng `role`
CREATE TABLE `roles` (
    `role_id` INT(11) NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`role_id`)
);

-- Thêm các vai trò 'admin' và 'user'
INSERT INTO `roles` (`role_name`) VALUES ('admin'), ('user');

-- Tạo bảng `user`
CREATE TABLE `users` (
    `user_id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255),
    `address` VARCHAR(255),
    `avatar` TEXT,
    `status` VARCHAR(255) DEFAULT 'active',
    `role_id` INT(11),
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE SET NULL
);

-- Tài khoản admin
INSERT INTO `users` (user_name, email, password, role_id)
VALUES ('admin', 'admin@gmail.com', '$2b$10$cNa0G95zPITx4j3cELEzDOV3kBpPrzZH2rlRESSnYb0YcuoTykO96', 1);

CREATE TABLE `categories` (
    `category_id` INT(11) NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`category_id`)
);

INSERT INTO `categories` (category_name) 
VALUES ('Motor điện - Động cơ điện'),
('Motor giảm tốc'),
('Hộp giảm NMRV'),
('Hộp giảm tốc trục vít, bánh răng'),
('Hộp giảm tốc vít me nâng hạ'),
('Bơm hút chân không'),
('Máy bơm nước'),
('Động cơ rung - Đầm rung'),
('Hộp giảm tốc trục vít, bánh răng'),
('Motor quạt thổi'),
('Motor - Động cơ cũ');

CREATE TABLE `products` (
    `product_id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `image` TEXT,
    `price` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(255) DEFAULT 'active',
    `stock` INT DEFAULT 0,
    `category_id` INT,
    PRIMARY KEY (`product_id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE SET NULL
);

CREATE TABLE `comments` (
    `comment_id` INT(11) NOT NULL AUTO_INCREMENT,
    `product_id` INT(11) NOT NULL,
    `user_id` INT(11) NOT NULL,
    `content` TEXT NOT NULL,
    `image` TEXT, 
    PRIMARY KEY (`comment_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

CREATE TABLE `orders` (
    `order_id` INT(11) NOT NULL AUTO_INCREMENT,
    `product_id` INT(11) NOT NULL,
    `user_id` INT(11) NOT NULL,
    `quantity` INT(11) NOT NULL,
    `total_money` DECIMAL(10, 2) NOT NULL,
    `payment_type` VARCHAR (255) NOT NULL,
    `order_status` VARCHAR (255) NOT NULL,
    `user_note` TEXT,
    PRIMARY KEY (`order_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

