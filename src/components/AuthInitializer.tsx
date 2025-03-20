'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthInitializer() {
  const { user } = useUser();

  useEffect(() => {
    const createUser = async () => {
      if (user?.sub) {
        try {
          // Try to create user (if they don't exist, they'll be created)
          const response = await fetch('/api/auth/user', {
            method: 'POST'
          });
          
          if (!response.ok) {
            console.error('Failed to create user:', await response.text());
          }
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      }
    };

    createUser();
  }, [user]);

  return null;
} 