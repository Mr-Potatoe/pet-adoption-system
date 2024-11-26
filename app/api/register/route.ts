import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { RegisterPayload, AuthResponse } from '@/types';

export async function POST(req: NextRequest) {
  const payload: RegisterPayload = await req.json();

  const { username, email, password, role } = payload;

  // Validation
  if (!username || !email || !password || !role) {
    return NextResponse.json<AuthResponse>({
      success: false,
      message: 'All fields are required.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(query, [username, email, hashedPassword, role]);

    return NextResponse.json<AuthResponse>({
      success: true,
      message: 'User registered successfully.',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<AuthResponse>({
      success: false,
      message: 'Error registering user.',
    });
  }
}
