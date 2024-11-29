import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ success: false, message: 'Token expired' }, { status: 401 });
      }
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const adopterId = decoded?.userId;

    if (!adopterId) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { petId } = body;

    if (!petId) {
      return NextResponse.json({ success: false, message: 'Pet ID is required' }, { status: 400 });
    }

    const [petRows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM pets WHERE pet_id = ? AND status = "Available"',
      [petId]
    );

    const pet = petRows[0];
    if (!pet) {
      return NextResponse.json(
        { success: false, message: 'Pet is not available for adoption' },
        { status: 400 }
      );
    }

    try {
      const [applicationResult] = await db.query<ResultSetHeader>(
        'INSERT INTO adoption_applications (user_id, pet_id, status) VALUES (?, ?, "Pending")',
        [adopterId, petId]
      );

      const applicationId = applicationResult.insertId;

      await db.query('UPDATE pets SET status = "Pending" WHERE pet_id = ?', [petId]);

      return NextResponse.json({
        success: true,
        message: 'Adoption application submitted successfully',
        applicationId,
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      console.error('Failed Query:', dbError.sql);
      return NextResponse.json({ success: false, message: 'Database operation failed' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in adoption API:', error.message);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
