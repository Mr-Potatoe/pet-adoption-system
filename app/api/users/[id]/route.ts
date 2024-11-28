import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Adjust the path if necessary
import { ResultSetHeader } from 'mysql2/promise'; // Import ResultSetHeader

interface User {
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'shelter_staff' | 'adopter';
  profile_picture?: string;
}

// PUT: Update a specific user by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id, 10);
  const { username, email, role, profile_picture }: { username: string; email: string; role: string; profile_picture: string | null } = await req.json();

  if (!username || !email || !role) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    // Type the result as ResultSetHeader
    const result: ResultSetHeader = await query('UPDATE users SET username = ?, email = ?, role = ?, profile_picture = ? WHERE user_id = ?', [
      username,
      email,
      role,
      profile_picture,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User not found or no changes made.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}



// GET: Fetch a specific user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
  }

  try {
    // Query to retrieve the user by ID
    const user = await query<{ user_id: number; username: string; email: string; role: string }[]>(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ user: user[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve user.' }, { status: 500 });
  }
}



// DELETE: Delete a specific user by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
  }

  try {
    // Delete user from the database
    await query('DELETE FROM users WHERE user_id = ?', [userId]);

    return NextResponse.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}
