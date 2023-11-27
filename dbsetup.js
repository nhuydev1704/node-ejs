const mysql = require("mysql");

const DB_HOST = "127.0.0.1";
const DB_USER = "wpr";
const DB_PASSWORD = "fit2023";
const DB_DATABASE = "wpr2023";

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: 3306,
});

const runScript = (connection) => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      confirmPassword VARCHAR(255) NOT NULL
    )
  `;

  connection.query(createUsersTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating users table: " + err.stack);
      return;
    }
    console.log("Users table created or already exists.");
  });

  //   tạo bảng message

  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS message (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        content TEXT,
        file VARCHAR(255),
        is_read TINYINT DEFAULT 0,
        title TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating message table: " + err.stack);
    } else {
      console.log("Message table created or already exists.");
    }

    // Đóng kết nối sau khi hoàn thành công việc
    connection.end();
  });
};

connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database");
  runScript(connection);
});
