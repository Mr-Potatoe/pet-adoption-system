import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Pet {
  pet_id: number;
  name: string;
  breed: string | null;
  age: number | null;
  description: string | null;
  medical_history: string | null;
  status: 'Available' | 'Adopted' | 'Pending';
  image_url: string | null;
  created_at: string;
  user_id: number;
  gender: string | null;
  contact: string | null;
  location: string | null;
  age_unit: 'days' | 'weeks' | 'months' | 'years';
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  console.log('Pet ID:', params.id); // Debugging the ID

  try {
    const result = await query<Pet[]>('SELECT * FROM pets WHERE pet_id = ?', [Number(params.id)]); // Make sure the ID is converted to number if necessary

    console.log('Database result:', result); // Log the result for debugging

    if (result.length === 0) {
      return NextResponse.json({ message: 'Pet not found', success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, pet: result[0] }); // Return the pet details in the response
  } catch (error) {
    console.error('Error fetching pet:', error);
    return NextResponse.json({ message: 'Error fetching pet', success: false }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Parse the request body
  const body = await req.json();

  // Validate the incoming data
  const {
    name,
    breed,
    age,
    description,
    medical_history,
    status,
    image_url,
    gender,
    contact,
    location,
    age_unit,
  } = body;

  if (!name || !status || !age || !age_unit) {
    return NextResponse.json({ message: 'Required fields missing' }, { status: 400 });
  }

  // Prepare the update query with the provided data
  const updateQuery = `
    UPDATE pets 
    SET 
      name = ?, 
      breed = ?, 
      age = ?, 
      description = ?, 
      medical_history = ?, 
      status = ?, 
      image_url = ?, 
      gender = ?, 
      contact = ?, 
      location = ?, 
      age_unit = ? 
    WHERE pet_id = ?
  `;

  const values = [
    name,
    breed,
    age,
    description,
    medical_history,
    status,
    image_url,
    gender,
    contact,
    location,
    age_unit,
    Number(id),
  ];

  try {
    const result = await query(updateQuery, values);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Pet not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pet updated successfully' });
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json({ message: 'Error updating pet', success: false }, { status: 500 });
  }
}


// DELETE handler
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const result = await query('DELETE FROM pets WHERE pet_id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Pet not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting pet' }, { status: 500 });
  }
}
