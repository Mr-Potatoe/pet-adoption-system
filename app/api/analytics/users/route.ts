import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const sql = 'SELECT role, COUNT(*) as count FROM users GROUP BY role';

  try {
    const result = await query(sql);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
