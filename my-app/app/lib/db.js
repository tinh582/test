// src/lib/db.js
import mysql from 'mysql2/promise';

const dbPort = Number(process.env.DB_PORT || 3306);
const useSsl = process.env.DB_SSL === 'true';

const poolConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quan_ly_chi_tieu',
      port: Number.isFinite(dbPort) ? dbPort : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    };

export const db = mysql.createPool(poolConfig);