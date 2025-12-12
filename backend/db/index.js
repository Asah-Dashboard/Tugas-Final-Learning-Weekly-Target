// backend/db.js

const mysql = require('mysql2/promise');
require('dotenv').config();

// Config object
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'learningweeklytarget',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// ✅ HANYA tambahkan password kalau ada dan tidak kosong
const dbPassword = process.env.DB_PASSWORD;
if (dbPassword && dbPassword.trim() !== '') {
  config.password = dbPassword;
}

console.log('📊 Database Config:');
console.log('   Host:', config.host);
console.log('   User:', config.user);
console.log('   Database:', config.database);
console.log('   Port:', config.port);
console.log('   Has Password:', !!config.password);

const pool = mysql.createPool(config);

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Connected Successfully!\n');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL Connection Failed!');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('\nPlease check:');
    console.error('1. MySQL is running in Laragon');
    console.error('2. Database "learningweeklytarget" exists');
    console.error('3. .env file is correct\n');
    process.exit(1);
  });

module.exports = pool;
