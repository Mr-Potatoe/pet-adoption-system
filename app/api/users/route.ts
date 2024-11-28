import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Adjust the path if necessary
import bcrypt from 'bcryptjs';

interface User {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'shelter_staff' | 'adopter';
  profile_picture?: string | null;
}

// Backend: POST route for creating a user
export async function POST(req: Request) {
  try {
    const { username, email, password, role, profile_picture }: User = await req.json();

    // Validate input data
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await query<{ insertId: number }>('INSERT INTO users (username, email, password_hash, role, profile_picture) VALUES (?, ?, ?, ?, ?)', 
      [username, email, password_hash, role, profile_picture || null]);

    return NextResponse.json({ message: 'User created successfully.', user_id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const { user_id, username, email, password, role, profile_picture }: User & { user_id: number } = await req.json();

    // Validate input data
    if (!user_id || !username || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    let password_hash = undefined;
    // Only hash the password if it is being updated
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Update user in the database
    const result = await query<{ affectedRows: number }>(
      'UPDATE users SET username = ?, email = ?, password_hash = ?, role = ?, profile_picture = ? WHERE user_id = ?',
      [
        username,
        email,
        password_hash || undefined, // Only set password_hash if it's provided
        role,
        profile_picture || null,
        user_id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User not found or no changes made.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}


export async function GET() {
  try {
    // Fetch all users from the database
    const users = await query<{ user_id: number; username: string; email: string; role: string }[]>('SELECT * FROM users');
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }
}


