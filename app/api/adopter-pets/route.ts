import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Assuming db query function is set up

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const adopterId = url.searchParams.get('adopterId');
    const status = url.searchParams.get('status'); // Get the status filter from query params

    if (!adopterId) {
      return NextResponse.json({ success: false, message: 'Adopter ID is required' }, { status: 400 });
    }

    let petsQuery = `
      SELECT * FROM pets 
      WHERE user_id = ? OR user_id = ?
    `;

    // Add status filter to the query if provided
    if (status && status !== 'All') {
      petsQuery += ` AND status = ?`; // Assuming 'status' is a field in your 'pets' table
    }

    // Query pets based on adopterId and status
    const pets = await query<any[]>(petsQuery, status && status !== 'All' ? [adopterId, adopterId, status] : [adopterId, adopterId]);

    return NextResponse.json({ success: true, pets });
  } catch (err) {
    console.error('Error fetching pets:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch pets' }, { status: 500 });
  }
}
