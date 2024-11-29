import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Assuming your query function is set up

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Query the adoption history for the given user
    const adoptionHistoryQuery = `
      SELECT 
        pets.name AS pet_name,
        pets.breed,
        pets.age,
        pets.age_unit,
        pets.gender,
        pets.status AS pet_status,
        adoption_applications.status AS application_status,
        adoption_applications.created_at AS application_date,
        adoption_applications.application_id
      FROM adoption_applications
      JOIN pets ON adoption_applications.pet_id = pets.pet_id
      WHERE adoption_applications.user_id = ?
      ORDER BY adoption_applications.created_at DESC
    `;
    const adoptionHistory = await query<any[]>(adoptionHistoryQuery, [userId]);

    if (adoptionHistory.length === 0) {
      return NextResponse.json({ success: true, history: [] });
    }

    return NextResponse.json({ success: true, history: adoptionHistory });
  } catch (err) {
    console.error('Error fetching adoption history:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch adoption history' }, { status: 500 });
  }
}
