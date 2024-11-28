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
    // Check if the username or email already exists
    const checkQuery = `
      SELECT user_id FROM users WHERE username = ? OR email = ?
    `;
    const [existingUsers] = await db.execute(checkQuery, [username, email]);

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json<AuthResponse>({
        success: false,
        message: 'Username or email already exists.',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(insertQuery, [username, email, hashedPassword, role]);

    return NextResponse.json<AuthResponse>({
      success: true,
      message: 'Registered successfully.',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<AuthResponse>({
      success: false,
      message: 'Error registering user.',
    });
  }
}
