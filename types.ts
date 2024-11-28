// types.ts
export type Role = 'admin' | 'shelter_staff' | 'adopter';

// Update the User type (in the type definition file)
export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string; // This field stores the hashed password
  created_at: string;
  profile_picture: string | null;
  role: 'admin' | 'shelter_staff' | 'adopter'; // Example role values
}

// When creating a new user, you omit 'user_id' (which is handled in DB)
export type NewUser = Omit<User, 'user_id'>;


export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'shelter_staff' | 'adopter';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'password_hash'>;
}


export interface Pet {
  pet_id: number;
  name: string;
  breed: string | null;
  age: number | null;
  description: string | null;
  medical_history: string | null;
  status: 'Available' | 'Adopted' | 'Pending';
  image_url: string | null;
  created_at: Date;
  user_id: number;
  gender: string | null;
  contact: string | null;
  location: string | null;
  age_unit: 'days' | 'weeks' | 'months' | 'years';
}

export interface AdoptionApplication {
  application_id: number;
  user_id: number | null;
  pet_id: number | null;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  role: 'admin' | 'shelter_staff' | 'adopter';
  profile_picture: string | null;
}

export type UserRole = 'admin' | 'shelter_staff' | 'adopter';
