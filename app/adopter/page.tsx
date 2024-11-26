'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Adopter = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }

    const fetchPets = async () => {
      const response = await fetch('/api/pets'); // Assuming you have an API for this
      const data = await response.json();
      if (data.success) {
        setPets(data.pets);
      } else {
        setError(data.message);
      }
    };

    fetchPets();
  }, [router]);

  return (
    <div>
      <h1>Adopter Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Available Pets</h2>
      <ul>
        {pets.map((pet: any) => (
          <li key={pet.pet_id}>{pet.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Adopter;
