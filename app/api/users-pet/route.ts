// app/api/users-pets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', ''); // Extract the Bearer token
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken: any = jwt.decode(token); // Decode the JWT token
    const userId = decodedToken?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID not found' }, { status: 400 });
    }

    const pets = await query('SELECT * FROM pets WHERE user_id = ?', [userId]); // Fetch pets for the logged-in user
    return NextResponse.json({
      success: true,
      pets,
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json({ success: false, message: 'Error fetching pets' }, { status: 500 });
  }
}
