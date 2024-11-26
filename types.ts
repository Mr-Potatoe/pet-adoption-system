// types.ts
export type Role = 'admin' | 'shelter_staff' | 'adopter';

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  email: string;
  role: Role;
  created_at: string;
  profile_picture: string | null;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: Role;
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
  