import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Define a type for the pet
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


// POST handler to add a new pet
export async function POST(req: NextRequest) {
    const data = await req.json();
  
    // Validate required fields
    const requiredFields = ['name', 'age', 'status', 'user_id', 'age_unit'];
    const missingFields = requiredFields.filter((field) => !data[field]);
  
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
  
    try {
      const insertQuery = `
        INSERT INTO pets (
          name, breed, age, description, medical_history, status, image_url, 
          user_id, gender, contact, location, age_unit, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
  
      const result = await query(insertQuery, [
        data.name,
        data.breed || null,
        data.age,
        data.description || null,
        data.medical_history || null,
        data.status,
        data.image_url || null,
        data.user_id,
        data.gender || null,
        data.contact || null,
        data.location || null,
        data.age_unit,
      ]);
  
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Pet added successfully',
        pet: {
          pet_id: (result as any).insertId, // Assuming your DB returns the new ID
          ...data,
          created_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error adding pet:', error);
      return NextResponse.json(
        { success: false, message: 'Error adding pet' },
        { status: 500 }
      );
    }
  }
// GET all pets
// GET all available pets
export async function GET(req: NextRequest) {
  try {
    // Fetch only pets with 'Available' status
    const pets = await query<Pet[]>('SELECT * FROM pets WHERE status = "Available"');

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



// PUT handler
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
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


  
