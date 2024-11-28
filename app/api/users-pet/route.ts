import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

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

// POST handler to add a new pet for the authenticated user
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  // Validate required fields
  const requiredFields = ['name', 'age', 'status', 'user_id', 'age_unit'];
  const missingFields = requiredFields.filter((field) => data[field] == null); // Handle null or undefined

  if (missingFields.length > 0) {
    return NextResponse.json(
      { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    // Decode the token to get the user_id from JWT
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken: any = jwt.decode(token);
    const userId = decodedToken?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID not found' }, { status: 400 });
    }

    // Insert new pet
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
      userId,
      data.gender || null,
      data.contact || null,
      data.location || null,
      data.age_unit,
    ]);

    if ((result as any).insertId) {
      return NextResponse.json({
        success: true,
        message: 'Pet added successfully',
        pet: {
          pet_id: (result as any).insertId, // Assuming your DB returns the new ID
          ...data,
          created_at: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to insert pet' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error adding pet' }, { status: 500 });
  }
}

// GET handler to fetch pets for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken: any = jwt.decode(token);
    const userId = decodedToken?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID not found' }, { status: 400 });
    }

    // Fetch pets belonging to the authenticated user
    const pets = await query<Pet[]>('SELECT * FROM pets WHERE user_id = ?', [userId]);

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

// PUT handler to update an existing pet
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken: any = jwt.decode(token);
    const userId = decodedToken?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID not found' }, { status: 400 });
    }

    // Update the pet details
    const updateQuery = `
        UPDATE pets 
        SET name = ?, breed = ?, age = ?, description = ?, medical_history = ?, status = ?, 
            image_url = ?, gender = ?, contact = ?, location = ?, age_unit = ? 
        WHERE pet_id = ? AND user_id = ?
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
        userId,  // Ensure the pet belongs to the authenticated user
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
