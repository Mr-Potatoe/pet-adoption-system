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

