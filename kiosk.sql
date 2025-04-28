-- kiosk 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `kiosk` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `kiosk`;

-- 테이블 kiosk.branch 구조 내보내기
CREATE TABLE IF NOT EXISTS `branch` (
  `branch_id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`branch_id`)
)

-- 테이블 데이터 kiosk.branch:~3 rows (대략적) 내보내기
INSERT IGNORE INTO `branch` (`branch_id`, `branch_name`, `location`) VALUES
	(1, '강서지점', 'Seoul, Gangseo-gu'),
	(2, '상봉지점', 'Seoul, Jungnang-gu'),
	(3, '하남지점', 'Gyeonggi-do, Hanam-si');

-- 테이블 kiosk.fcmtoken 구조 내보내기
CREATE TABLE IF NOT EXISTS `fcmtoken` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
)

-- 테이블 kiosk.menu 구조 내보내기
CREATE TABLE IF NOT EXISTS `menu` (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `menu_code` varchar(100) DEFAULT NULL,
  `other` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`menu_id`)
)

-- 테이블 데이터 kiosk.menu:~25 rows (대략적) 내보내기
INSERT IGNORE INTO `menu` (`menu_id`, `menu_name`, `description`, `category`, `image`, `menu_code`, `other`) VALUES
	(1, '31요거트', '상큼한 요거트의 부드러운 맛', '아이스크림', '31요거트.png', 'YK31', ''),
	(2, '그린티', '깊고 진한 녹차 맛의 아이스크림', '아이스크림', '그린티.png', 'GT72', ''),
	(3, '나주배소르베', '시원하고 달콤한 나주배 소르베', '아이스크림', '나주배소르베.png', 'NJ39', ''),
	(4, '너는참달고나', '추억의 달고나를 아이스크림으로', '아이스크림', '너는참달고나.png', 'DK07', ''),
	(5, '뉴욕치즈케이크', '부드럽고 고소한 뉴욕식 치즈케이크 맛', '아이스크림', '뉴욕치즈케이크.png', 'NYC5', ''),
	(6, '딸기연유퐁당', '달콤한 딸기와 연유의 완벽한 조화', '아이스크림', '딸기연유퐁당.png', 'SY99', ''),
	(7, '레인보우샤베트', '다양한 과일맛이 어우러진 상큼한 샤베트', '아이스크림', '레인보우샤베트.png', 'RB41', ''),
	(8, '말랑꿀떡모찌', '쫀득한 모찌와 꿀이 들어간 달콤한 아이스크림', '아이스크림', '말랑꿀떡모찌.png', 'MC23', ''),
	(9, '민트초코', '상쾌한 민트와 진한 초콜릿의 조합', '아이스크림', '민트초코.png', 'MC98', ''),
	(10, '바람과함께사라지다', '부드럽고 풍미 가득한 바닐라 베이스', '아이스크림', '바람과함께사라지다.png', 'BW12', ''),
	(11, '베리베리스트로베리', '딸기 본연의 맛이 풍부한 아이스크림', '아이스크림', '베리베리스트로베리.png', 'VS45', ''),
	(12, '봉쥬르마카롱', '달콤한 마카롱 조각이 들어간 고급스러운 맛', '아이스크림', '봉쥬르마카롱.png', 'BM30', ''),
	(13, '블루베리파나코타', '상큼한 블루베리와 달콤한 크림의 조화', '아이스크림', '블루베리파나코타.png', 'BP19', ''),
	(14, '사랑에빠진딸기', '신선한 딸기 과육이 듬뿍 들어간 맛', '아이스크림', '사랑에빠진딸기.png', 'LS77', ''),
	(15, '소금우유아이스크림', '달콤짭짤한 소금과 우유의 완벽한 조합', '아이스크림', '소금우유아이스크림.png', 'SM53', ''),
	(16, '슈팅스타', '톡톡 튀는 캔디가 들어간 재미있는 아이스크림', '아이스크림', '슈팅스타.png', 'SS88', ''),
	(17, '아몬드봉봉', '바삭한 아몬드와 초콜릿의 고소한 맛', '아이스크림', '아몬드봉봉.png', 'AB04', ''),
	(18, '아이스도쿄바나나', '부드러운 바나나와 진한 초콜릿의 만남', '아이스크림', '아이스도쿄바나나.png', 'CB60', ''),
	(19, '아이스초코도쿄바나나', '진하고 부드러운 클래식 초콜릿과 바나나의 만남', '아이스크림', '아이스초코도쿄바나나.png', 'CH33', ''),
	(20, '아이스호떡', '따뜻한 호떡 맛을 아이스크림으로 재현', '아이스크림', '아이스호떡.png', 'HT56', ''),
	(21, '애플민트', '사과의 달콤함과 민트의 상쾌함', '아이스크림', '애플민트.png', 'AM91', ''),
	(22, '엄마는외계인', '초콜릿과 바삭한 초코볼이 가득', '아이스크림', '엄마는외계인.png', 'MA02', ''),
	(23, '에스프레소앤크림', '진한 에스프레소 향과 부드러운 크림 맛', '아이스크림', '에스프레소앤크림.png', 'EC47', ''),
	(24, '오레오쿠키앤크림', '오레오 쿠키와 부드러운 크림의 환상적인 조합', '아이스크림', '오레오쿠키앤크림.png', 'OK14', '');

-- 테이블 kiosk.payment 구조 내보내기
CREATE TABLE IF NOT EXISTS `payment` (
  `payment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `final_amount` int(11) DEFAULT NULL,
  `payment_date` datetime NOT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `sub_items_json` text DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_product` (`product_id`),
  KEY `fk_payment_branch` (`branch_id`),
  CONSTRAINT `fk_payment_branch` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`),
  CONSTRAINT `fk_payment_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
)

-- 테이블 데이터 kiosk.payment:~49 rows (대략적) 내보내기
INSERT IGNORE INTO `payment` (`payment_id`, `product_id`, `branch_id`, `quantity`, `final_amount`, `payment_date`, `serial_number`, `payment_method`, `sub_items_json`) VALUES
	(1, 1, 1, 0, 11400, '2025-04-17 11:58:10', '202504171158106980', '삼성페이', '[{"name":"싱글레귤러","totalQuantity":1,"subItems":[{"type":"cup","flavors":["바람과함께사라지다"],"unitPrice":3200,"quantity":1,"productName":"싱글레귤러"}],"paymentMethod":"삼성페이"},{"name":"파인트","totalQuantity":1,"subItems":[{"type":"cup","flavors":["바람과함께사라지다","베리베리스트로베리","봉쥬르마카롱"],"unitPrice":8200,"quantity":1,"productName":"파인트"}],"paymentMethod":"삼성페이"}]'),
	(2, 6, 1, 0, 42100, '2025-04-17 12:35:20', '202504171235206199', '해피페이', '[{"name":"쿼터","totalQuantity":1,"subItems":[{"type":"cup","flavors":["봉쥬르마카롱","에스프레소앤크림","아이스호떡","엄마는외계인"],"unitPrice":15500,"quantity":1,"productName":"쿼터"}],"paymentMethod":"해피페이"},{"name":"싱글킹","totalQuantity":2,"subItems":[{"type":"cup","flavors":["바람과함께사라지다"],"unitPrice":4000,"quantity":1,"productName":"싱글킹"},{"type":"cone","flavors":["봉쥬르마카롱"],"unitPrice":4000,"quantity":1,"productName":"싱글킹"}],"paymentMethod":"해피페이"},{"name":"더블레귤러","totalQuantity":3,"subItems":[{"type":"cone","flavors":["바람과함께사라지다","베리베리스트로베리"],"unitPrice":6200,"quantity":2,"productName":"더블레귤러"},{"type":"waffle","flavors":["민트초코","딸기연유퐁당"],"unitPrice":6200,"quantity":1,"productName":"더블레귤러"}],"paymentMethod":"해피페이"}]'),
	(3, 1, 1, 0, 3200, '2025-04-17 12:43:27', '202504171243279185', '신용카드', '[{"name":"싱글레귤러","totalQuantity":1,"subItems":[{"type":"cone","flavors":["베리베리스트로베리"],"unitPrice":3200,"quantity":1,"productName":"싱글레귤러"}],"paymentMethod":"신용카드"}]'),
	(4, 5, 1, 0, 8200, '2025-04-17 12:48:11', '202504171248116781', '해피페이', '[{"name":"파인트","totalQuantity":1,"subItems":[{"type":"cup","flavors":["베리베리스트로베리","레인보우샤베트","말랑꿀떡모찌"],"unitPrice":8200,"quantity":1,"productName":"파인트"}],"paymentMethod":"해피페이"}]'),
	(5, 3, 1, 0, 4300, '2025-04-17 12:50:17', '202504171250176417', '삼성페이', '[{"name":"더블주니어","totalQuantity":1,"subItems":[{"type":"cone","flavors":["봉쥬르마카롱","베리베리스트로베리"],"unitPrice":4300,"quantity":1,"productName":"더블주니어"}],"paymentMethod":"삼성페이"}]'),
	(6, 3, 1, 0, 4300, '2025-04-21 06:32:54', '202504210632543025', '삼성페이', '[{"name":"더블주니어","totalQuantity":1,"subItems":[{"type":"cone","flavors":["바람과함께사라지다","민트초코"],"unitPrice":4300,"quantity":1,"productName":"더블주니어"}],"paymentMethod":"삼성페이"}]'),
	(7, 2, 1, 0, 4000, '2025-04-21 16:59:07', '202504211659073536', '신용카드', '[{"name":"싱글킹","totalQuantity":1,"subItems":[{"type":"cup","flavors":["민트초코"],"unitPrice":4000,"quantity":1,"productName":"싱글킹"}],"paymentMethod":"신용카드"}]'),
	(8, 2, 1, 0, 18400, '2025-04-22 12:27:14', '202504221227149750', '카카오페이', '[{"name":"싱글킹","totalQuantity":1,"subItems":[{"type":"cup","flavors":["민트초코"],"unitPrice":4000,"quantity":1,"productName":"싱글킹"}],"paymentMethod":"카카오페이"},{"name":"파인트","totalQuantity":1,"subItems":[{"type":"cup","flavors":["말랑꿀떡모찌","나주배소르베","레인보우샤베트"],"unitPrice":8200,"quantity":1,"productName":"파인트"}],"paymentMethod":"카카오페이"},{"name":"더블레귤러","totalQuantity":1,"subItems":[{"type":"waffle","flavors":["민트초코","바람과함께사라지다"],"unitPrice":6200,"quantity":1,"productName":"더블레귤러"}],"paymentMethod":"카카오페이"}]'),
	(9, 2, 1, 0, 4000, '2025-04-22 12:32:44', '202504221232446374', '카카오페이', '[{"name":"싱글킹","totalQuantity":1,"subItems":[{"type":"cup","flavors":["민트초코"],"unitPrice":4000,"quantity":1,"productName":"싱글킹"}],"paymentMethod":"카카오페이"}]');

-- 테이블 kiosk.product 구조 내보내기
CREATE TABLE IF NOT EXISTS `product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `max_flavors` int(11) NOT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_name` (`product_name`)
)

-- 테이블 데이터 kiosk.product:~8 rows (대략적) 내보내기
INSERT IGNORE INTO `product` (`product_id`, `product_name`, `price`, `max_flavors`) VALUES
	(1, '싱글레귤러', 3200, 1),
	(2, '싱글킹', 4000, 1),
	(3, '더블주니어', 4300, 2),
	(4, '더블레귤러', 6200, 2),
	(5, '파인트', 8200, 3),
	(6, '쿼터', 15500, 4),
	(7, '패밀리', 22000, 5),
	(8, '하프갤런', 26500, 6);

-- 테이블 kiosk.stock 구조 내보내기
CREATE TABLE IF NOT EXISTS `stock` (
  `stock_id` int(11) NOT NULL AUTO_INCREMENT,
  `branch_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `product_status` varchar(50) DEFAULT NULL,
  `order_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`stock_id`),
  KEY `branch_id` (`branch_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE CASCADE,
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`) ON DELETE CASCADE
)

-- 테이블 데이터 kiosk.stock:~24 rows (대략적) 내보내기
INSERT IGNORE INTO `stock` (`stock_id`, `branch_id`, `menu_id`, `quantity`, `product_status`, `order_status`) VALUES
	(1, 1, 1, 100, '판매중', '배송완료'),
	(2, 1, 2, 100, '판매중', '배송중'),
	(3, 1, 3, 100, '판매중단', '배송중'),
	(4, 1, 4, 100, '판매중단', '확인중'),
	(5, 1, 5, 100, '판매중', '확인중'),
	(6, 1, 6, 100, '판매중단', '배송중'),
	(7, 1, 7, 100, '판매중', '배송완료'),
	(8, 1, 8, 100, '판매중', '확인중'),
	(9, 1, 9, 100, '판매중', '확인중'),
	(10, 1, 10, 100, '판매중', '배송중'),
	(11, 1, 11, 100, '판매중', '확인중'),
	(12, 1, 12, 100, '판매중', '확인중'),
	(13, 1, 13, 100, '판매중', '확인중'),
	(14, 1, 14, 100, '판매중', '확인중'),
	(15, 1, 15, 100, '판매중', '확인중'),
	(16, 1, 16, 100, '판매중', '확인중'),
	(17, 1, 17, 100, '판매중', '확인중'),
	(18, 1, 18, 100, '판매중', '확인중'),
	(19, 1, 19, 100, '판매중', '확인중'),
	(20, 1, 20, 100, '판매중', '확인중'),
	(21, 1, 21, 100, '판매중', '확인중'),
	(22, 1, 22, 100, '판매중', '확인중'),
	(23, 1, 23, 100, '판매중', '확인중'),
	(24, 1, 24, 100, '판매중', '확인중'),
	(25, 2, 1, 100, '판매중', '확인중'),
	(26, 2, 2, 100, '판매중', '확인중'),
	(27, 2, 3, 100, '판매중단', '확인중'),
	(28, 2, 4, 100, '판매중단', '확인중'),
	(29, 2, 5, 100, '판매중', '확인중'),
	(30, 2, 6, 100, '판매중단', '확인중'),
	(31, 2, 7, 100, '판매중', '확인중'),
	(32, 2, 8, 100, '판매중', '확인중'),
	(33, 2, 9, 100, '판매중', '확인중'),
	(34, 2, 10, 100, '판매중', '확인중'),
	(35, 2, 11, 100, '판매중', '확인중'),
	(36, 2, 12, 100, '판매중', '확인중'),
	(37, 2, 13, 100, '판매중', '확인중'),
	(38, 2, 14, 100, '판매중', '확인중'),
	(39, 2, 15, 100, '판매중', '확인중'),
	(40, 2, 16, 100, '판매중', '확인중'),
	(41, 2, 17, 100, '판매중', '확인중'),
	(42, 2, 18, 100, '판매중', '확인중'),
	(43, 2, 19, 100, '판매중', '확인중'),
	(44, 2, 20, 100, '판매중', '확인중'),
	(45, 2, 21, 100, '판매중', '확인중'),
	(46, 2, 22, 100, '판매중', '확인중'),
	(47, 2, 23, 100, '판매중', '확인중'),
	(48, 2, 24, 100, '판매중', '확인중'),
	(49, 3, 1, 100, '판매중', '확인중'),
	(50, 3, 2, 100, '판매중', '확인중'),
	(51, 3, 3, 100, '판매중단', '확인중'),
	(52, 3, 4, 100, '판매중단', '확인중'),
	(53, 3, 5, 100, '판매중', '확인중'),
	(54, 3, 6, 100, '판매중단', '확인중'),
	(55, 3, 7, 100, '판매중', '확인중'),
	(56, 3, 8, 100, '판매중', '확인중'),
	(57, 3, 9, 100, '판매중', '확인중'),
	(58, 3, 10, 100, '판매중', '확인중'),
	(59, 3, 11, 100, '판매중', '확인중'),
	(60, 3, 12, 100, '판매중', '확인중'),
	(61, 3, 13, 100, '판매중', '확인중'),
	(62, 3, 14, 100, '판매중', '확인중'),
	(63, 3, 15, 100, '판매중', '확인중'),
	(64, 3, 16, 100, '판매중', '확인중'),
	(65, 3, 17, 100, '판매중', '확인중'),
	(66, 3, 18, 100, '판매중', '확인중'),
	(67, 3, 19, 100, '판매중', '확인중'),
	(68, 3, 20, 100, '판매중', '확인중'),
	(69, 3, 21, 100, '판매중', '확인중'),
	(70, 3, 22, 100, '판매중', '확인중'),
	(71, 3, 23, 100, '판매중', '확인중'),
	(72, 3, 24, 100, '판매중', '확인중');

-- 테이블 kiosk.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','branch') NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE CASCADE
)

-- 테이블 데이터 kiosk.user:~2 rows (대략적) 내보내기
INSERT IGNORE INTO `user` (`user_id`, `username`, `password`, `role`, `branch_id`) VALUES
	(1, 'admin', '1234', 'admin', NULL),
	(2, 'branch', '1234', 'branch', 1);