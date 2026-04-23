// src/app/api/health/route.js
import { db } from '../../lib/db';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
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