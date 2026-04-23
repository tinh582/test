// src/app/api/transactions/route.js
import { db } from '../../lib/db';
import { NextResponse } from 'next/server';

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  'https://web-frontend-rho-opal.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

const defaultOrigin = 'https://web-frontend-rho-opal.vercel.app';

const buildCorsHeaders = (requestOrigin) => {
  const allowOrigin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : defaultOrigin;

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
};

// Xử lý Preflight Request (Bắt buộc khi dùng fetch POST từ domain/port khác)
export async function OPTIONS(request) {
  const requestOrigin = request.headers.get('origin') || '';
  return NextResponse.json({}, { headers: buildCorsHeaders(requestOrigin) });
}

// LẤY DANH SÁCH GIAO DỊCH
export async function GET(request) {
  const requestOrigin = request.headers.get('origin') || '';
  const corsHeaders = buildCorsHeaders(requestOrigin);

  try {
    // Trích xuất category_name thành category để khớp với state Frontend
    const query = `
      SELECT 
        id, 
        title, 
        amount, 
        category_name AS category, 
        DATE_FORMAT(date, '%Y-%m-%d') AS date, 
        createdAt 
      FROM transactions 
      ORDER BY date DESC, createdAt DESC
    `;
    const [rows] = await db.query(query);

    return NextResponse.json(rows, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Lỗi GET transactions:', error);
    return NextResponse.json(
      { message: 'Lỗi máy chủ khi tải dữ liệu.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// THÊM GIAO DỊCH MỚI
export async function POST(request) {
  const requestOrigin = request.headers.get('origin') || '';
  const corsHeaders = buildCorsHeaders(requestOrigin);

  try {
    const body = await request.json();
    const { title, amount, category, date, createdAt } = body;

    // Validate
    if (!title || !amount || !date) {
      return NextResponse.json(
        { message: 'Vui lòng nhập đầy đủ tên, số tiền và ngày.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const query = `
      INSERT INTO transactions (user_id, title, amount, category_name, date, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Mặc định user_id = 1 vì chưa làm chức năng đăng nhập
    const values = [
      1, 
      title, 
      Number(amount), 
      category || 'Khác', 
      date, 
      createdAt || new Date().toISOString()
    ];

    const [result] = await db.query(query, values);

    // Trả về object vừa tạo để Frontend update state ngay lập tức
    const newTransaction = {
      id: result.insertId,
      title,
      amount: Number(amount),
      category: category || 'Khác',
      date,
      createdAt: createdAt || new Date().toISOString(),
    };

    return NextResponse.json(newTransaction, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Lỗi POST transactions:', error);
    return NextResponse.json(
      { message: 'Lỗi máy chủ khi lưu giao dịch.' },
      { status: 500, headers: corsHeaders }
    );
  }
}