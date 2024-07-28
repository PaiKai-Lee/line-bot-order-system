CREATE DATABASE order_db;

USE order_db;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id VARCHAR(255) NOT NULL COMMENT 'line 群組id',
    order_id VARCHAR(255) NOT NULL UNIQUE COMMENT '訂單編號',
    status INT NOT NULL DEFAULT 0 COMMENT '訂單狀態 0: 未完成 1: 已完成 2: 已取消',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL COMMENT '訂單編號',
    user_id VARCHAR(255) NOT NULL COMMENT '使用者 line id',
    user_name VARCHAR(255) NOT NULL '輸入名稱',
    product_name VARCHAR(255) NOT NULL COMMENT '產品名稱',
    quantity INT NOT NULL DEFAULT 1 COMMENT '下單數量',
    remark VARCHAR(255) NOT NULL DEFAULT '' COMMENT '備註',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (order_id)
);