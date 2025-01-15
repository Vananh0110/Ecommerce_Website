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
    `status` VARCHAR(255) DEFAULT 'Đang hoạt động',
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
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`comment_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);


CREATE TABLE `cart` (
    `cart_id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `product_id` INT(11) NOT NULL,
    `quantity` INT(11) NOT NULL,
    PRIMARY KEY (`cart_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
);

CREATE TABLE `orders` (
    `order_id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `total_money` DECIMAL(10, 2) NOT NULL,
    `payment_type` VARCHAR(255) NOT NULL,
    `order_status` VARCHAR(255) NOT NULL DEFAULT 'Chờ xử lý',
    `receiver_name` VARCHAR(255) NOT NULL,
    `receiver_phone` VARCHAR(255) NOT NULL,
    `receiver_address` TEXT NOT NULL,
    `user_note` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE `order_items` (
    `order_item_id` INT(11) NOT NULL AUTO_INCREMENT,
    `order_id` INT(11) NOT NULL,
    `product_id` INT(11) NOT NULL,
    `quantity` INT(11) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_item_id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO `products` VALUES (1,'Động cơ điện 3 pha 37kW 50HP','Động cơ điện 3 pha 37kw 50hp còn gọi là motor điện 3 pha 37kw 50hp. Động cơ thế hệ mới tiết kiệm điện năng, đa dạng tốc độ vòng tua, lực mô-men xoắn và chất lượng cao, phù hợp với nhiều điều kiện môi trường làm việc khác nhau.','uploads/products/1736214682682-Dongcodien3pha.jpg',16500000.00,'In stock',100,1),(2,'Động cơ điện 3 pha 15kW 20HP','Động cơ điện 3 pha 15kw 20hp còn gọi là motor điện 3 pha 15kw 20hp. Động cơ thế hệ mới tiết kiệm điện năng, đa dạng tốc độ vòng tua, lực mô-men xoắn và chất lượng cao, phù hợp với nhiều điều kiện môi trường làm việc khác nhau.','uploads/products/1736214937759-Dongcodien3pha.jpg',7500000.00,'In stock',250,1),(3,'Động cơ điện 3 pha 1.5kW 2HP','Động cơ điện 3 pha 1.5kw 2hp còn gọi là motor điện 3 pha 1.5kw 2hp. Động cơ thế hệ mới tiết kiệm điện năng, đa dạng tốc độ vòng tua, lực mô-men xoắn và chất lượng cao, phù hợp với nhiều điều kiện môi trường làm việc khác nhau.','uploads/products/1736214994039-Dongcodien3pha.jpg',1500000.00,'In stock',240,1),(4,'Động cơ điện 3 pha 1.1kW 1.5HP','Động cơ điện 3 pha 1.1kw 1.5hp còn gọi là motor điện 3 pha 1.1kw 1.5hp. Động cơ thế hệ mới tiết kiệm điện năng, đa dạng tốc độ vòng tua, lực mô-men xoắn và chất lượng cao, phù hợp với nhiều điều kiện môi trường làm việc khác nhau.','uploads/products/1736215048494-Dongcodien3pha.jpg',1300000.00,'In stock',210,1),(5,'Động phòng nổ 11kw 15HP','Động cơ phòng nổ 11kW 15Hp còn được gọi là motor phòng nổ. Ngoại hình của mô tơ được dầy dặn hơn khi sản xuất theo công nghệ phát triển bật nhất tại Đức. Là dòng động cơ có khả năng chống chịu va đập mạnh và sẽ chống được cháy nổ khi xảy ra sự cố chập điện, Nhiệt độ môi trường hiện nay dễ gây ra cháy nổ động cơ chịu đựng được và phòng chống khi có cháy nổ xảy ra.','uploads/products/1736215188748-Dongcophongno.jpg',14400000.00,'In stock',150,1),(6,'Động phòng nổ 15kw 20HP','Động cơ phòng nổ 15kW 20Hp còn được gọi là motor phòng nổ. Ngoại hình của mô tơ được dầy dặn hơn khi sản xuất theo công nghệ phát triển bật nhất tại Đức. Là dòng động cơ có khả năng chống chịu va đập mạnh và sẽ chống được cháy nổ khi xảy ra sự cố chập điện, Nhiệt độ môi trường hiện nay dễ gây ra cháy nổ động cơ chịu đựng được và phòng chống khi có cháy nổ xảy ra.','uploads/products/1736215244155-Dongcophongno.jpg',16110000.00,'In stock',200,1),(7,'Động phòng nổ 3kw 4HP','Động cơ phòng nổ 3kW 4Hp còn được gọi là motor phòng nổ. Ngoại hình của mô tơ được dầy dặn hơn khi sản xuất theo công nghệ phát triển bật nhất tại Đức. Là dòng động cơ có khả năng chống chịu va đập mạnh và sẽ chống được cháy nổ khi xảy ra sự cố chập điện, Nhiệt độ môi trường hiện nay dễ gây ra cháy nổ động cơ chịu đựng được và phòng chống khi có cháy nổ xảy ra.','uploads/products/1736215315966-Dongcophongno.jpg',6150000.00,'In stock',180,1),(8,'Động phòng nổ 22kw 30HP','Động cơ phòng nổ 22kW 30Hp còn được gọi là motor phòng nổ. Ngoại hình của mô tơ được dầy dặn hơn khi sản xuất theo công nghệ phát triển bật nhất tại Đức. Là dòng động cơ có khả năng chống chịu va đập mạnh và sẽ chống được cháy nổ khi xảy ra sự cố chập điện, Nhiệt độ môi trường hiện nay dễ gây ra cháy nổ động cơ chịu đựng được và phòng chống khi có cháy nổ xảy ra.','uploads/products/1736215362251-Dongcophongno.jpg',23650000.00,'In stock',120,1),(9,'Motor giảm tốc 1 pha 0.2kw 0.25hp','Motor giảm tốc 1 pha 0.2kw 0.25hp hay còn gọi là động cơ giảm tốc 0.2kw 0.25hp với đa dạng tỉ số truyền, đường kính trục và kiểu lắp đặt, nguồn điện sử dụng dân dụng 1 pha 220V nên được sử dụng phổ biến hầu hết trên thị trường. Cùng tìm hiểu rõ hơn về thông số bản vẽ kết cấu của động cơ giảm tốc này nhé!','uploads/products/1736215480813-motorgiamtoc.jpg',2400000.00,'In stock',110,2),(10,'Motor giảm tốc 1 pha 0.4kW 0.5Hp','Motor giảm tốc 1 pha 0.4kw 0.5hp hay còn gọi là động cơ giảm tốc 0.4kw 0.5hp với đa dạng tỉ số truyền, đường kính trục và kiểu lắp đặt, nguồn điện sử dụng dân dụng 1 pha 220V nên được sử dụng phổ biến hầu hết trên thị trường. Cùng tìm hiểu rõ hơn về thông số bản vẽ kết cấu của động cơ giảm tốc này nhé!','uploads/products/1736215516757-motorgiamtoc.jpg',2900000.00,'In stock',150,2),(11,'Motor giảm tốc 1 pha 0.8kW 1Hp','Motor giảm tốc 1 pha 0.8kw 1hp hay còn gọi là động cơ giảm tốc 0.8kw 1hp với đa dạng tỉ số truyền, đường kính trục và kiểu lắp đặt, nguồn điện sử dụng dân dụng 1 pha 220V nên được sử dụng phổ biến hầu hết trên thị trường. Cùng tìm hiểu rõ hơn về thông số bản vẽ kết cấu của động cơ giảm tốc này nhé!','uploads/products/1736215567798-motorgiamtoc.jpg',3300000.00,'In stock',140,2),(12,'Motor giảm tốc 1 pha  1.5kW 2Hp','Motor giảm tốc 1 pha 1.5kW 2Hp hay còn gọi là động cơ giảm tốc 1.5kW 2Hp với đa dạng tỉ số truyền, đường kính trục và kiểu lắp đặt, nguồn điện sử dụng dân dụng 1 pha 220V nên được sử dụng phổ biến hầu hết trên thị trường. Cùng tìm hiểu rõ hơn về thông số bản vẽ kết cấu của động cơ giảm tốc này nhé!','uploads/products/1736215614113-motorgiamtoc.jpg',4950000.00,'In stock',160,2),(13,'Motor giảm tốc 1 pha  2.2kW 3Hp','Motor giảm tốc 1 pha 2.2kW 3Hp hay còn gọi là động cơ giảm tốc 2.2kW 3Hp với đa dạng tỉ số truyền, đường kính trục và kiểu lắp đặt, nguồn điện sử dụng dân dụng 1 pha 220V nên được sử dụng phổ biến hầu hết trên thị trường. Cùng tìm hiểu rõ hơn về thông số bản vẽ kết cấu của động cơ giảm tốc này nhé!','uploads/products/1736215659021-motorgiamtoc.jpg',640000.00,'In stock',150,2),(14,'Motor giảm tốc có phanh 0.75kW 1Hp','Motor giảm tốc có phanh 0.75kW 1Hp hay còn gọi là động cơ giảm tốc có phanh 0.75kW 1Hp. Là một thiết bị được thiết kế chuyên dụng, có công suất 0.75kW 1Hp dùng để giảm tốc độ vòng quay một cách đột ngột hay tăng lực momen xoắn.','uploads/products/1736215883392-motorgiamtoc.jpg',5200000.00,'In stock',150,2),(15,'Motor giảm tốc có phanh 1.5kW 2Hp','Motor giảm tốc có phanh 1.5kW 2Hp hay còn gọi là động cơ giảm tốc có phanh 1.5kW 2Hp. Là một thiết bị được thiết kế chuyên dụng, có công suất 1.5kW 2Hp dùng để giảm tốc độ vòng quay một cách đột ngột hay tăng lực momen xoắn.','uploads/products/1736215929289-motorgiamtoc.jpg',6000000.00,'In stock',140,2),(16,'Motor giảm tốc có phanh 2.2kW 3Hp','Motor giảm tốc có phanh 2.2kW 3Hp hay còn gọi là động cơ giảm tốc có phanh 2.2kW 3Hp. Là một thiết bị được thiết kế chuyên dụng, có công suất 2.2kW 3Hp dùng để giảm tốc độ vòng quay một cách đột ngột hay tăng lực momen xoắn.','uploads/products/1736215986026-motorgiamtoc.jpg',8800000.00,'In stock',170,2),(17,'Motor giảm tốc mini 140w','Motor giảm tốc mini 140w còn có tên gọi là động cơ giảm tốc mini. Motor giảm tốc mini được cấu tạo vỏ bên ngoài từ chất liệu nhôm nên giúp cho việc trọng lượng của máy nhẹ và lắp đặt được rất đa dạng trên mọi ứng dụng mà người sử dụng cần sử dụng. Motor giảm tốc mini 140w có giá cả rất hợp lý và vừa với túi tiền của người tiêu dùng.','uploads/products/1736216067123-motorgiamtocmini.jpg',2200000.00,'In stock',150,2),(18,'Motor giảm tốc mini 180w','Motor giảm tốc mini 180w còn có tên gọi là động cơ giảm tốc mini. Motor giảm tốc mini được cấu tạo vỏ bên ngoài từ chất liệu nhôm nên giúp cho việc trọng lượng của máy nhẹ và lắp đặt được rất đa dạng trên mọi ứng dụng mà người sử dụng cần sử dụng. Motor giảm tốc mini 180w có giá cả rất hợp lý và vừa với túi tiền của người tiêu dùng.','uploads/products/1736216094484-motorgiamtocmini.jpg',2500000.00,'In stock',120,2),(19,'Motor giảm tốc mini 250w','Motor giảm tốc mini 250w còn có tên gọi là động cơ giảm tốc mini. Motor giảm tốc mini được cấu tạo vỏ bên ngoài từ chất liệu nhôm nên giúp cho việc trọng lượng của máy nhẹ và lắp đặt được rất đa dạng trên mọi ứng dụng mà người sử dụng cần sử dụng. Motor giảm tốc mini 250w có giá cả rất hợp lý và vừa với túi tiền của người tiêu dùng.','uploads/products/1736216130116-motorgiamtocmini.jpg',3600000.00,'In stock',160,2),(20,'Hộp giảm tốc NMRV 110','Hộp giảm tốc NMRV 110 được dùng chủ yếu trong máy móc công nghiệp nặng. Sản phẩm là loại hộp số có trục vào và trục ra vuông góc với nhau. Có thể gắn với motor qua mặt bích hoặc lắp rời với buly hoặc khớp nối, dễ dàng cho người sử dụng. Hộp số được dùng trong trong băng tải công nghiệp, máy khuấy , dây chuyền sản xuất đồ chơi…','uploads/products/1736216233597-hopgiamtocnmrv.png',5800000.00,'In stock',160,3),(21,'Hộp giảm tốc NMRV 130','Hộp giảm tốc NMRV 130 được dùng chủ yếu trong máy móc công nghiệp nặng. Sản phẩm là loại hộp số có trục vào và trục ra vuông góc với nhau. Có thể gắn với motor qua mặt bích hoặc lắp rời với buly hoặc khớp nối, dễ dàng cho người sử dụng. Hộp số được dùng trong trong băng tải công nghiệp, máy khuấy , dây chuyền sản xuất đồ chơi…','uploads/products/1736216268540-hopgiamtocnmrv.png',6800000.00,'In stock',140,3),(22,'Hộp giảm tốc NMRV 40','Hộp giảm tốc NMRV 40 được dùng chủ yếu trong máy móc công nghiệp nặng. Sản phẩm là loại hộp số có trục vào và trục ra vuông góc với nhau. Có thể gắn với motor qua mặt bích hoặc lắp rời với buly hoặc khớp nối, dễ dàng cho người sử dụng. Hộp số được dùng trong trong băng tải công nghiệp, máy khuấy , dây chuyền sản xuất đồ chơi…','uploads/products/1736216299888-hopgiamtocnmrv.png',910000.00,'In stock',200,3),(23,'Hộp giảm tốc NMRV 75','Hộp giảm tốc NMRV 75 được dùng chủ yếu trong máy móc công nghiệp nặng. Sản phẩm là loại hộp số có trục vào và trục ra vuông góc với nhau. Có thể gắn với motor qua mặt bích hoặc lắp rời với buly hoặc khớp nối, dễ dàng cho người sử dụng. Hộp số được dùng trong trong băng tải công nghiệp, máy khuấy , dây chuyền sản xuất đồ chơi…','uploads/products/1736216328149-hopgiamtocnmrv.png',2000000.00,'In stock',210,3),(24,'Hộp giảm tốc NMRV 90','Hộp giảm tốc NMRV 90 được dùng chủ yếu trong máy móc công nghiệp nặng. Sản phẩm là loại hộp số có trục vào và trục ra vuông góc với nhau. Có thể gắn với motor qua mặt bích hoặc lắp rời với buly hoặc khớp nối, dễ dàng cho người sử dụng. Hộp số được dùng trong trong băng tải công nghiệp, máy khuấy , dây chuyền sản xuất đồ chơi…','uploads/products/1736216355589-hopgiamtocnmrv.png',2800000.00,'In stock',220,3),(25,'Hộp giảm tốc NMRV 63','Hộp giảm tốc NMRV 63 được dùng chủ yếu trong máy móc công nghiệp nặng. Sản phẩm là loại hộp số có trục vào và trục ra vuông góc với nhau. Có thể gắn với motor qua mặt bích hoặc lắp rời với buly hoặc khớp nối, dễ dàng cho người sử dụng. Hộp số được dùng trong trong băng tải công nghiệp, máy khuấy , dây chuyền sản xuất đồ chơi…','uploads/products/1736216386184-hopgiamtocnmrv.png',2800000.00,'In stock',120,3),(26,'Hộp giảm tốc trục vít WP 100','Gồm các loại size 100: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304124960-hopgiamtoctrucvitbanhrang.jpg',2800000.00,'In stock',110,4),(27,'Hộp giảm tốc trục vít WP 120','Gồm các loại size 120: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304155868-hopgiamtoctrucvitbanhrang.jpg',4200000.00,'In stock',100,4),(28,'Hộp giảm tốc trục vít WP 135','Gồm các loại size 135: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304178295-hopgiamtoctrucvitbanhrang.jpg',5900000.00,'In stock',150,4),(29,'Hộp giảm tốc trục vít WP 155','Gồm các loại size 155: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304206863-hopgiamtoctrucvitbanhrang.jpg',8200000.00,'In stock',190,4),(30,'Hộp giảm tốc trục vít WP 175','Gồm các loại size 175: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304232696-hopgiamtoctrucvitbanhrang.jpg',10200000.00,'In stock',180,4),(31,'Hộp giảm tốc trục vít WP 60','Gồm các loại size 60: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304265314-hopgiamtoctrucvitbanhrang.jpg',1250000.00,'In stock',140,4),(32,'Hộp giảm tốc trục vít WP 70','Gồm các loại size 70: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304290600-hopgiamtoctrucvitbanhrang.jpg',1550000.00,'In stock',130,4),(33,'Hộp giảm tốc trục vít WP 80','Gồm các loại size 80: WPA, WPS, WPO, WPX, WPDS, WPDA, WPDO, WPDX với các tỉ số truyền: 1/10, 1/20, 1/30, 1/40, 1/50, 1/60','uploads/products/1736304310793-hopgiamtoctrucvitbanhrang.jpg',1850000.00,'In stock',150,4),(34,'Hộp giảm tốc vít me SWLD10 SWL10','Hộp giảm tốc vít me SWLD10 SWL10 là thiết bị cơ khí một cấp, chuyên dùng để chuyển đổi chuyển động quay của động cơ điện thành chuyển động thẳng, phục vụ cho các hệ thống nâng hạ. Với thiết kế nhỏ gọn, chất liệu bền bỉ và khả năng chịu tải lên đến 3 tấn, sản phẩm này đảm bảo hiệu suất cao và độ tin cậy trong nhiều ứng dụng công nghiệp khác nhau.','uploads/products/1736304455762-hopgiamtocvitme2.jpg',11400000.00,'In stock',250,5),(35,'Hộp giảm tốc vít me SWLD5 SWL5','Hộp giảm tốc vít me SWLD5 SWL5 là thiết bị cơ khí một cấp, chuyên dùng để chuyển đổi chuyển động quay của động cơ điện thành chuyển động thẳng, phục vụ cho các hệ thống nâng hạ. Với thiết kế nhỏ gọn, chất liệu bền bỉ và khả năng chịu tải lên đến 3 tấn, sản phẩm này đảm bảo hiệu suất cao và độ tin cậy trong nhiều ứng dụng công nghiệp khác nhau.','uploads/products/1736304492841-hopgiamtocvitme2.jpg',6700000.00,'In stock',150,5),(36,'Hộp giảm tốc vít me SWLD2.5 SWL2.5','Hộp giảm tốc vít me SWLD2.5 SWL2.5 là thiết bị cơ khí một cấp, chuyên dùng để chuyển đổi chuyển động quay của động cơ điện thành chuyển động thẳng, phục vụ cho các hệ thống nâng hạ. Với thiết kế nhỏ gọn, chất liệu bền bỉ và khả năng chịu tải lên đến 3 tấn, sản phẩm này đảm bảo hiệu suất cao và độ tin cậy trong nhiều ứng dụng công nghiệp khác nhau.','uploads/products/1736304521526-hopgiamtocvitme2.jpg',4800000.00,'In stock',160,5),(37,'Hộp giảm tốc vít me SWLD8 SWL8','Hộp giảm tốc vít me SWLD8 SWL8 là thiết bị cơ khí một cấp, chuyên dùng để chuyển đổi chuyển động quay của động cơ điện thành chuyển động thẳng, phục vụ cho các hệ thống nâng hạ. Với thiết kế nhỏ gọn, chất liệu bền bỉ và khả năng chịu tải lên đến 3 tấn, sản phẩm này đảm bảo hiệu suất cao và độ tin cậy trong nhiều ứng dụng công nghiệp khác nhau.','uploads/products/1736304561931-hopgiamtocvitmenangha.jpg',9100000.00,'In stock',160,5),(38,'Bơm hút chân không đầu liền 2.2KW 3HP','Máy bơm hút chân không đầu liền là loại bơm được dùng để loại bỏ các phân tử khí hoặc hơi nước,… nhằm mục đích để lại môi trường chân không hoặc gần chân không.','uploads/products/1736304662927-hopgiamtocvitmenangha.jpg',12500000.00,'In stock',120,6),(39,'Bơm hút chân không đầu liền 30KW 40HP','Máy bơm hút chân không đầu liền là loại bơm được dùng để loại bỏ các phân tử khí hoặc hơi nước,… nhằm mục đích để lại môi trường chân không hoặc gần chân không.','uploads/products/1736304687659-hopgiamtocvitmenangha.jpg',65900000.00,'In stock',130,6),(40,'Bơm hút chân không đầu liền 37KW 50HP','Máy bơm hút chân không đầu liền là loại bơm được dùng để loại bỏ các phân tử khí hoặc hơi nước,… nhằm mục đích để lại môi trường chân không hoặc gần chân không.','uploads/products/1736304706476-hopgiamtocvitmenangha.jpg',82000000.00,'In stock',130,6),(41,'Bơm hút chân không đầu liền 5.5KW 7.5HP','Máy bơm hút chân không đầu liền là loại bơm được dùng để loại bỏ các phân tử khí hoặc hơi nước,… nhằm mục đích để lại môi trường chân không hoặc gần chân không.','uploads/products/1736304734762-hopgiamtocvitmenangha.jpg',22000000.00,'In stock',120,6),(42,'Bơm hút chân không đầu liền 7.5KW 10HP','Máy bơm hút chân không đầu liền là loại bơm được dùng để loại bỏ các phân tử khí hoặc hơi nước,… nhằm mục đích để lại môi trường chân không hoặc gần chân không.','uploads/products/1736304766637-hopgiamtocvitmenangha.jpg',24500000.00,'In stock',170,6),(43,'Bơm hút chân không đầu liền 0.8KW 1HP','Máy bơm hút chân không đầu liền là loại bơm được dùng để loại bỏ các phân tử khí hoặc hơi nước,… nhằm mục đích để lại môi trường chân không hoặc gần chân không.','uploads/products/1736304899686-hopgiamtocvitmenangha.jpg',11000000.00,'In stock',170,6),(44,'Bơm hút chân không đầu liền 11KW 15HP','Máy bơm hút chân không đầu liền là loại bơm được dùng để loại bỏ các phân tử khí hoặc hơi nước,… nhằm mục đích để lại môi trường chân không hoặc gần chân không.','uploads/products/1736304928137-hopgiamtocvitmenangha.jpg',29500000.00,'In stock',170,6),(45,'Máy bơm nước 1 pha công suất 0.37KW 0.5HP','Các loại bơm: Bơm nước ly tâm, bơm chìm; điện áp 1 pha 220V','uploads/products/1736305081932-maybomnuoc1pha.jpg',1300000.00,'In stock',150,7),(46,'Máy bơm nước 1 pha công suất 0.55KW 0.75HP','Các loại bơm: Bơm nước ly tâm, bơm chìm; điện áp 1 pha 220V','uploads/products/1736305102271-maybomnuoc1pha.jpg',1600000.00,'In stock',150,7),(47,'Máy bơm nước 1 pha công suất 0.75KW 1HP','Các loại bơm: Bơm nước ly tâm, bơm chìm; điện áp 1 pha 220V','uploads/products/1736305118741-maybomnuoc1pha.jpg',1800000.00,'In stock',150,7),(48,'Máy bơm nước 1 pha công suất 1.1KW 1.5HP','Các loại bơm: Bơm nước ly tâm, bơm chìm; điện áp 1 pha 220V','uploads/products/1736305140902-maybomnuoc1pha.jpg',2200000.00,'In stock',150,7),(49,'Máy bơm nước 1 pha công suất 2.2KW 3HP','Các loại bơm: Bơm nước ly tâm, bơm chìm; điện áp 1 pha 220V','uploads/products/1736305159670-maybomnuoc1pha.jpg',2500000.00,'In stock',150,7),(50,'Máy bơm nước 3 pha 1.5KW 2HP','Các kiểu bơm thông dụng: Bơm nước ly tâm, bơm nước TECO, bơm nước Inox; Mã bơm nước: G33-50-3HP-60, G33-65-3HP-76, G33-80-3HP-90, CM32-160B-3HP, 3M32-160-3HP, CM40-125B-3HP, 3M40-125-3HP; Đường kính ống hút/xả: 60/60, 76/76, 90/90, 60/42, 76/49','uploads/products/1736305280957-maybomnuoc3pha.jpg',5200000.00,'In stock',160,7),(51,'Máy bơm nước 3 pha 11KW 15HP','Các kiểu bơm thông dụng: Bơm nước ly tâm, bơm nước TECO, bơm nước Inox; Mã bơm nước: G33-50-3HP-60, G33-65-3HP-76, G33-80-3HP-90, CM32-160B-3HP, 3M32-160-3HP, CM40-125B-3HP, 3M40-125-3HP; Đường kính ống hút/xả: 60/60, 76/76, 90/90, 60/42, 76/49','uploads/products/1736305309938-maybomnuoc3pha.jpg',13000000.00,'In stock',160,7),(52,'Máy bơm nước 3 pha 15KW 20HP','Các kiểu bơm thông dụng: Bơm nước ly tâm, bơm nước TECO, bơm nước Inox; Mã bơm nước: G33-50-3HP-60, G33-65-3HP-76, G33-80-3HP-90, CM32-160B-3HP, 3M32-160-3HP, CM40-125B-3HP, 3M40-125-3HP; Đường kính ống hút/xả: 60/60, 76/76, 90/90, 60/42, 76/49','uploads/products/1736305325629-maybomnuoc3pha.jpg',13900000.00,'In stock',160,7),(53,'Máy bơm nước 3 pha 2.2KW 3HP','Các kiểu bơm thông dụng: Bơm nước ly tâm, bơm nước TECO, bơm nước Inox; Mã bơm nước: G33-50-3HP-60, G33-65-3HP-76, G33-80-3HP-90, CM32-160B-3HP, 3M32-160-3HP, CM40-125B-3HP, 3M40-125-3HP; Đường kính ống hút/xả: 60/60, 76/76, 90/90, 60/42, 76/49','uploads/products/1736305343603-maybomnuoc3pha.jpg',16900000.00,'In stock',160,7),(54,'Máy bơm nước teco 1.5KW 2HP','Kiểu bơm thông thường: Bơm ly tâm Teco, Bơm Teco bơm nước sạch, Bơm Teco bơm nước nóng, Bơm Teco bơm hóa chất ăn mòn; Phân loại: Máy bơm nước TECO đầu gang, Máy bơm nước TECO đầu inox; Mã bơm: G32-40-2HP-49, G32-50-2HP-60, G32-65-2HP-76','uploads/products/1736305466320-maybomnuocteco.jpg',3900000.00,'In stock',180,7),(55,'Máy bơm nước teco 11KW 15HP','Kiểu bơm thông thường: Bơm ly tâm Teco, Bơm Teco bơm nước sạch, Bơm Teco bơm nước nóng, Bơm Teco bơm hóa chất ăn mòn; Phân loại: Máy bơm nước TECO đầu gang, Máy bơm nước TECO đầu inox; Mã bơm: G32-40-2HP-49, G32-50-2HP-60, G32-65-2HP-76','uploads/products/1736305487408-maybomnuocteco.jpg',25600000.00,'In stock',180,7),(56,'Máy bơm nước teco 15KW 20HP','Kiểu bơm thông thường: Bơm ly tâm Teco, Bơm Teco bơm nước sạch, Bơm Teco bơm nước nóng, Bơm Teco bơm hóa chất ăn mòn; Phân loại: Máy bơm nước TECO đầu gang, Máy bơm nước TECO đầu inox; Mã bơm: G32-40-2HP-49, G32-50-2HP-60, G32-65-2HP-76','uploads/products/1736305502712-maybomnuocteco.jpg',28600000.00,'In stock',180,7),(57,'Động cơ rung đầm rung 1.5kw 2hp','Động cơ rung đầm rung hay còn gọi là động cơ rung là thiết bị được dùng để chuyển đổi năng lượng điện sang năng lượng rung hoặc lắc; Điện áp: 1 pha 220V, 3 pha 380V','uploads/products/1736305637286-Dongcorungdamrung.jpeg',2900000.00,'In stock',150,8),(58,'Động cơ rung đầm rung 0.25kw 0.34hp','Động cơ rung đầm rung hay còn gọi là động cơ rung là thiết bị được dùng để chuyển đổi năng lượng điện sang năng lượng rung hoặc lắc; Điện áp: 1 pha 220V, 3 pha 380V','uploads/products/1736305665529-Dongcorungdamrung.jpeg',1600000.00,'In stock',150,8),(59,'Động cơ rung đầm rung 0.37kw 0.5hp','Động cơ rung đầm rung hay còn gọi là động cơ rung là thiết bị được dùng để chuyển đổi năng lượng điện sang năng lượng rung hoặc lắc; Điện áp: 1 pha 220V, 3 pha 380V','uploads/products/1736305685085-Dongcorungdamrung.jpeg',1900000.00,'In stock',150,8),(60,'Động cơ rung đầm rung 0.75kw 1hp','Động cơ rung đầm rung hay còn gọi là động cơ rung là thiết bị được dùng để chuyển đổi năng lượng điện sang năng lượng rung hoặc lắc; Điện áp: 1 pha 220V, 3 pha 380V','uploads/products/1736305706513-Dongcorungdamrung.jpeg',2100000.00,'In stock',150,8),(61,'Động cơ rung đầm rung 1.1kw 1.5hp','Động cơ rung đầm rung hay còn gọi là động cơ rung là thiết bị được dùng để chuyển đổi năng lượng điện sang năng lượng rung hoặc lắc; Điện áp: 1 pha 220V, 3 pha 380V','uploads/products/1736305734400-Dongcorungdamrung.jpeg',2320000.00,'In stock',150,8),(62,'Động cơ rung đầm rung mini 0.02KW','Động cơ rung đầm rung mini 0.02kW là thiết bị nhỏ gọn, chuyên dùng để tạo lực rung trong các ứng dụng như làm phẳng bề mặt bê tông, sàng lọc nguyên liệu hoặc đầm nén. Với công suất 0.02kW, thiết bị đảm bảo hiệu suất ổn định và tiết kiệm năng lượng.','uploads/products/1736305817122-Dongcorunggammini.jpg',1300000.00,'In stock',160,8),(63,'Động cơ rung đầm rung mini 0.04KW','Động cơ rung đầm rung mini 0.04kW là thiết bị nhỏ gọn, chuyên dùng để tạo lực rung trong các ứng dụng như làm phẳng bề mặt bê tông, sàng lọc nguyên liệu hoặc đầm nén. Với công suất 0.04kW, thiết bị đảm bảo hiệu suất ổn định và tiết kiệm năng lượng.','uploads/products/1736305846256-Dongcorunggammini.jpg',1710000.00,'In stock',160,8),(64,'Động cơ rung đầm rung mini 0.13KW','Động cơ rung đầm rung mini 0.13kW là thiết bị nhỏ gọn, chuyên dùng để tạo lực rung trong các ứng dụng như làm phẳng bề mặt bê tông, sàng lọc nguyên liệu hoặc đầm nén. Với công suất 0.13kW, thiết bị đảm bảo hiệu suất ổn định và tiết kiệm năng lượng.','uploads/products/1736305877686-Dongcorunggammini.jpg',2000000.00,'In stock',160,8),(65,'Motor quạt thổi 1.5KW 2HP','Motor quạt thổi 1.5KW 2HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736306257621-motorquathoi.jpg',6000000.00,'In stock',120,9),(66,'Motor quạt thổi 11KW 15HP','Motor quạt thổi 11KW 15HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736306282136-motorquathoi.jpg',16000000.00,'In stock',120,9),(67,'Motor quạt thổi 15KW 20HP','Motor quạt thổi 15KW 20HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736306305661-motorquathoi.jpg',17500000.00,'In stock',120,9),(68,'Motor quạt thổi 18.5KW 25HP','Motor quạt thổi 18.5KW 25HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736306330994-motorquathoi.jpg',23500000.00,'In stock',120,9),(69,'Motor quạt thổi 2.2KW 3HP','Motor quạt thổi 2.2KW 3HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736306360070-motorquathoi.jpg',8500000.00,'In stock',120,9),(70,'Motor quạt thổi 22KW 30HP','Motor quạt thổi 22KW 30HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736308407539-motorquathoi.jpg',31450000.00,'In stock',120,9),(71,'Motor quạt thổi 3.5KW 7HP','Motor quạt thổi 3.5KW 7HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736308440263-motorquathoi.jpg',11000000.00,'In stock',120,9),(72,'Motor quạt thổi 30KW 40HP','Motor quạt thổi 30KW 40HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736308466689-motorquathoi.jpg',34100000.00,'In stock',120,9),(73,'Motor quạt thổi 37KW 50HP','Motor quạt thổi 37KW 50HP hay còn gọi là motor quạt sò nhôm cao áp (quạt con sò) với áp lực gió cực lớn 2000 Pa, phù hợp sử dụng cho nhu cầu cần áp suất cao. Với ứng dụng vào hệ thống tạo áp cao thích hợp sử dụng cho cổng chào, thổi lò hơi, cầu trượt hơi, lò sấy, hầm lò đốt, thổi khí…','uploads/products/1736308506696-motorquathoi.jpg',48000000.00,'In stock',120,9),(74,'Bơm Teco cũ đầu Inox 23KW','Là dòng máy bơm có xuất xứ Đài Loan, khả năng hoạt động vô cùng bền bỉ và hiệu quả, đáp ứng hầu hết tất cả các nhu cầu sử dụng máy bơm của khách hàng.\nChính vì thế bơm nước Teco đầu inox đang được sử dụng khá phổ biến hiện nay. Máy bơm sử dụng điện áp 3 pha, dùng trong môi trường hóa chất, nước nóng, nước mặn hoặc nước lên men. Ngoài ra, ta có thể thấy bơm đầu inox trong các ứng dụng cụ thể như: Chuyên dùng bơm nước có hóa chất hoặc phèn chua trong các nhà máy chế biến thực phẩm, hóa chất, sơn, dược; Dùng trong bơm hút bùn thải cho hố móng xây dựng hay khi xử lý nước ngập úng','uploads/products/1736308923839-motorquathoi.jpg',12000000.00,'In stock',60,10),(75,'Bơm Teco cũ đầu Inox 37KW','Là dòng máy bơm có xuất xứ Đài Loan, khả năng hoạt động vô cùng bền bỉ và hiệu quả, đáp ứng hầu hết tất cả các nhu cầu sử dụng máy bơm của khách hàng.\nChính vì thế bơm nước Teco đầu inox đang được sử dụng khá phổ biến hiện nay. Máy bơm sử dụng điện áp 3 pha, dùng trong môi trường hóa chất, nước nóng, nước mặn hoặc nước lên men. Ngoài ra, ta có thể thấy bơm đầu inox trong các ứng dụng cụ thể như: Chuyên dùng bơm nước có hóa chất hoặc phèn chua trong các nhà máy chế biến thực phẩm, hóa chất, sơn, dược; Dùng trong bơm hút bùn thải cho hố móng xây dựng hay khi xử lý nước ngập úng','uploads/products/1736308971910-maybomnuocteco.jpg',60000000.00,'In stock',60,10);

