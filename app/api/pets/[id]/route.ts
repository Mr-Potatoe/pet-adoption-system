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

// GET all pets based on status (Available, Pending, or both)
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status'); // Correctly access the status query parameter

  let queryString = 'SELECT * FROM pets WHERE status IN ("Available", "Pending")'; // Default to available and pending pets
  const queryParams: any[] = [];

  // If a specific status is provided, use it to filter
  if (status && ['Available', 'Pending'].includes(status)) {
    queryString = 'SELECT * FROM pets WHERE status = ?';
    queryParams.push(status); // Filter based on the status passed in the query
  }

  try {
    const pets = await query<Pet[]>(queryString, queryParams);

    return NextResponse.json({
      success: true,
      pets,
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching pets' },
      { status: 500 }
    );
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Ensure `id` is extracted correctly
  if (!id) {
    return NextResponse.json({ message: 'Pet ID is required' }, { status: 400 });
  }

  const data = await req.json();

  try {
    const updateQuery = `
      UPDATE pets 
      SET name = ?, breed = ?, age = ?, description = ?, medical_history = ?, status = ?, 
          image_url = ?, gender = ?, contact = ?, location = ?, age_unit = ? 
      WHERE pet_id = ?
    `;

    const result = await query(
      updateQuery,
      [
        data.name,
        data.breed,
        data.age,
        data.description,
        data.medical_history,
        data.status,
        data.image_url,
        data.gender,
        data.contact,
        data.location,
        data.age_unit,
        id,
      ]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Pet not found or not updated' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pet updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating pet' }, { status: 500 });
  }
}
