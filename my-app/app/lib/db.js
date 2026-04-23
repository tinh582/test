// src/lib/db.js
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quan_ly_chi_tieu',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let schemaInitPromise;

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
  `CREATE TABLE IF NOT EXISTS categories (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('expense','income') DEFAULT 'expense' COMMENT 'Loại: Chi tiêu hoặc Thu nhập',
    icon VARCHAR(50) DEFAULT NULL COMMENT 'Lưu tên icon nếu sau này làm UI có icon',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
  `CREATE TABLE IF NOT EXISTS transactions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL DEFAULT 1 COMMENT 'ID người dùng (tạm thời gán mặc định là 1)',
    category_name VARCHAR(100) NOT NULL DEFAULT 'Khác' COMMENT 'Tên danh mục (lấy trực tiếp từ input frontend)',
    title VARCHAR(255) NOT NULL COMMENT 'Tên khoản chi',
    amount BIGINT(20) NOT NULL COMMENT 'Số tiền (Dùng BIGINT cho tiền tệ VND)',
    date DATE NOT NULL COMMENT 'Ngày chi tiêu (YYYY-MM-DD)',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian thực tế bấm nút thêm',
    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT transactions_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
  `INSERT IGNORE INTO users (id, username, email, password_hash, created_at)
   VALUES (1, 'Admin', 'admin@example.com', 'hashed_password_here', CURRENT_TIMESTAMP)` ,
  `INSERT IGNORE INTO categories (id, name, type, icon, created_at) VALUES
   (1, 'Ăn uống', 'expense', NULL, CURRENT_TIMESTAMP),
   (2, 'Di chuyển', 'expense', NULL, CURRENT_TIMESTAMP),
   (3, 'Mua sắm', 'expense', NULL, CURRENT_TIMESTAMP),
   (4, 'Hóa đơn', 'expense', NULL, CURRENT_TIMESTAMP),
   (5, 'Giải trí', 'expense', NULL, CURRENT_TIMESTAMP),
   (6, 'Sức khỏe', 'expense', NULL, CURRENT_TIMESTAMP),
   (7, 'Học tập', 'expense', NULL, CURRENT_TIMESTAMP),
   (8, 'Gia đình', 'expense', NULL, CURRENT_TIMESTAMP),
   (9, 'Khác', 'expense', NULL, CURRENT_TIMESTAMP)`,
];

const seedTransactions = [
  [1, 1, 'Ăn uống', 'Ăn sáng phở bò', 45000, '2026-04-23', '2026-04-23 10:35:28'],
  [2, 1, 'Di chuyển', 'Đổ xăng xe máy', 60000, '2026-04-23', '2026-04-23 10:35:28'],
  [3, 1, 'Mua sắm', 'Mua áo thun', 250000, '2026-04-22', '2026-04-22 10:35:28'],
  [4, 1, 'Hóa đơn', 'Đóng tiền điện', 850000, '2026-04-21', '2026-04-21 10:35:28'],
];

export const ensureSchema = async () => {
  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      const connection = await db.getConnection();

      try {
        for (const statement of schemaStatements) {
          await connection.query(statement);
        }

        const [transactionRows] = await connection.query('SELECT COUNT(*) AS count FROM transactions');
        if (transactionRows[0].count === 0) {
          await connection.query(
            `INSERT INTO transactions (id, user_id, category_name, title, amount, date, createdAt) VALUES ?`,
            [seedTransactions]
          );
        }
      } finally {
        connection.release();
      }
    })();
  }

  return schemaInitPromise;
};