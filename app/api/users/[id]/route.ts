import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Adjust the path if necessary
import { ResultSetHeader } from 'mysql2/promise'; // Import ResultSetHeader
import bcrypt from 'bcryptjs'; // Add bcrypt for password hashing

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
  const { username, email, password, role, profile_picture }: User = await req.json();

  // Log incoming data for debugging
  console.log('Incoming data:', { username, email, password, role, profile_picture });

  if (!username || !email || !role) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    let updateFields: Array<any> = [username, email, role, profile_picture ?? null, userId];
    let updateQuery = 'UPDATE users SET username = ?, email = ?, role = ?, profile_picture = ? WHERE user_id = ?';

    if (password) {
      // If password is provided, hash it and include it in the update
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = 'UPDATE users SET username = ?, email = ?, role = ?, profile_picture = ?, password_hash = ? WHERE user_id = ?';
      updateFields = [username, email, role, profile_picture ?? null, hashedPassword, userId];
    }

    // Execute the update query
    const result: ResultSetHeader = await query(updateQuery, updateFields);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User not found or no changes made.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error:', error); // Log error for better debugging
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
