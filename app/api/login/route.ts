import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import { LoginPayload, AuthResponse, User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  const payload: LoginPayload = await req.json();

  const { email, password } = payload;

  if (!email || !password) {
    return NextResponse.json<AuthResponse>({
      success: false,
      message: 'Email and password are required.',
    });
  }

  try {
    // Fetch user with email
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    ) as [User[], any]; // Explicitly type the result

    const user = rows[0]; // Safely access the first row

    if (!user) {
      return NextResponse.json<AuthResponse>({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json<AuthResponse>({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Log the response before returning to check the data
    console.log({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        profile_picture: user.profile_picture,
      },
    });

    return NextResponse.json<AuthResponse>({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<AuthResponse>({
      success: false,
      message: 'Error logging in.',
    });
  }
}
