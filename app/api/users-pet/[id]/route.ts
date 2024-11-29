// app/api/users-pet/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

type Pet = {
  pet_id: string;
  name: string;
  type: string;
  status: string;
  user_id: string;
};

// PUT: Update a pet's details
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

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

    const data = await req.json(); // Parse the body of the request
    const { name, type, status = 'available' } = data;

    if (!name || !type) {
      return NextResponse.json({ success: false, message: 'Name and type are required' }, { status: 400 });
    }

    // Check if the pet belongs to the logged-in user
    const [pet]: Pet[] = await query('SELECT * FROM pets WHERE pet_id = ? AND user_id = ?', [id, userId]);

    if (!pet) {
      return NextResponse.json({ success: false, message: 'Pet not found or not owned by the user' }, { status: 404 });
    }

    // Update the pet details
    await query('UPDATE pets SET name = ?, type = ?, status = ? WHERE pet_id = ?', [name, type, status, id]);

    return NextResponse.json({
      success: true,
      pet: { pet_id: id, name, type, status },
    });
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json({ success: false, message: 'Error updating pet' }, { status: 500 });
  }
}

// DELETE: Delete a pet
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

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

    // Check if the pet belongs to the logged-in user
    const [pet]: Pet[] = await query('SELECT * FROM pets WHERE pet_id = ? AND user_id = ?', [id, userId]);

    if (!pet) {
      return NextResponse.json({ success: false, message: 'Pet not found or not owned by the user' }, { status: 404 });
    }

    // Delete the pet
    await query('DELETE FROM pets WHERE pet_id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return NextResponse.json({ success: false, message: 'Error deleting pet' }, { status: 500 });
  }
}
