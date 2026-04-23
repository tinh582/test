// src/app/api/health/route.js
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
};

export async function OPTIONS(request) {
  const requestOrigin = request.headers.get('origin') || '';
  return NextResponse.json({}, { headers: buildCorsHeaders(requestOrigin) });
}

export async function GET(request) {
  const requestOrigin = request.headers.get('origin') || '';
  const corsHeaders = buildCorsHeaders(requestOrigin);

  try {
    // Thử query 1 lệnh đơn giản để check DB
    await db.query('SELECT 1');
    
    return NextResponse.json({
      status: 'success',
      message: 'API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'API is running but Database connection failed',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 503, headers: corsHeaders });
  }
}