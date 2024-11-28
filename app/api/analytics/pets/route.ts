import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const sql = 'SELECT status, COUNT(*) as count FROM pets GROUP BY status';

  try {
    const result = await query(sql);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching pet stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
