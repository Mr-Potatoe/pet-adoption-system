import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

// Define the type for the adoption application
type AdoptionApplication = {
  application_id: number;
  user_id: number | null;
  pet_id: number | null;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  created_at: string;
  updated_at: string;
};

// Named export for GET method
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // This will come from the dynamic route (e.g., /api/adoption-applications/53)

  try {
    const applications = await query<AdoptionApplication[]>('SELECT * FROM adoption_applications WHERE application_id = ?', [id]);
    
    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = applications[0];
    return res.status(200).json(application);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching adoption application:', error.message);
      return res.status(500).json({ message: 'Failed to fetch adoption application', error: error.message });
    } else {
      console.error('Unknown error occurred', error);
      return res.status(500).json({ message: 'Failed to fetch adoption application', error: 'Unknown error' });
    }
  }
}

// Named export for PUT method
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // This will come from the dynamic route (e.g., /api/adoption-applications/53)
  const { status } = req.body;

  if (!status || !['Pending', 'Approved', 'Rejected', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const result = await query<{ affectedRows: number }>(
      'UPDATE adoption_applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE application_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(200).json({ message: 'Application status updated' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating adoption application:', error.message);
      return res.status(500).json({ message: 'Failed to update adoption application', error: error.message });
    } else {
      console.error('Unknown error occurred', error);
      return res.status(500).json({ message: 'Failed to update adoption application', error: 'Unknown error' });
    }
  }
}

// Named export for DELETE method
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // This will come from the dynamic route (e.g., /api/adoption-applications/53)

  try {
    const result = await query<{ affectedRows: number }>('DELETE FROM adoption_applications WHERE application_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting adoption application:', error.message);
      return res.status(500).json({ message: 'Failed to delete adoption application', error: error.message });
    } else {
      console.error('Unknown error occurred', error);
      return res.status(500).json({ message: 'Failed to delete adoption application', error: 'Unknown error' });
    }
  }
}
