import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Define a type for the adoption application
interface AdoptionApplication {
  application_id: number;
  user_id: number | null;
  pet_id: number | null;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

// POST handler to create a new adoption application
export async function POST(req: NextRequest) {
  const data = await req.json();

  // Validate required fields
  const requiredFields = ['user_id', 'pet_id', 'status'];
  const missingFields = requiredFields.filter((field) => data[field] == null);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const insertQuery = `
      INSERT INTO adoption_applications (
        user_id, pet_id, status, created_at, updated_at
      ) VALUES (?, ?, ?, NOW(), NOW())
    `;

    const result = await query(insertQuery, [
      data.user_id,
      data.pet_id,
      data.status,
    ]);

    if ((result as any).insertId) {
      return NextResponse.json({
        success: true,
        message: 'Adoption application created successfully',
        application: {
          application_id: (result as any).insertId,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to create application' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error creating adoption application' },
      { status: 500 }
    );
  }
}

// GET handler to retrieve all adoption applications with user and pet names
export async function GET(req: NextRequest) {
  try {
    const applicationsQuery = `
      SELECT 
        aa.application_id,
        u.username AS user_name,
        p.name AS pet_name,
        aa.status,
        aa.created_at,
        aa.updated_at
      FROM adoption_applications aa
      JOIN users u ON aa.user_id = u.user_id
      JOIN pets p ON aa.pet_id = p.pet_id;
    `;

    const applications = await query<AdoptionApplication[]>(applicationsQuery);

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    // Typecast error to access its message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('Error fetching adoption applications:', errorMessage);

    return NextResponse.json(
      { success: false, message: 'Error fetching adoption applications', error: errorMessage },
      { status: 500 }
    );
  }
}




// PUT handler to update adoption application status
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  // Validate required fields
  if (!data.status || !['Pending', 'Approved', 'Rejected', 'Cancelled'].includes(data.status)) {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
  }

  try {
    const updateQuery = `
      UPDATE adoption_applications 
      SET status = ?, updated_at = NOW() 
      WHERE application_id = ?
    `;

    const result = await query(updateQuery, [data.status, id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Application not found or not updated' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating adoption application' }, { status: 500 });
  }
}

// DELETE handler to delete an adoption application
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const deleteQuery = 'DELETE FROM adoption_applications WHERE application_id = ?';
    const result = await query(deleteQuery, [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Application not found or not deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Adoption application deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting adoption application' }, { status: 500 });
  }
}
