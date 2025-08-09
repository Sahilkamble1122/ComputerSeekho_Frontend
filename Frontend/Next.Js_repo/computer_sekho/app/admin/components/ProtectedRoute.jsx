'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        // No token found, redirect to login
        router.replace('/login');
        return;
      }

      try {
        // Validate token with backend by making a test API call
        const response = await fetch('http://localhost:8080/api/staff', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Token is valid
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage and redirect
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('admin');
          sessionStorage.removeItem('img_path');
          router.replace('/login');
          return;
        }
      } catch (error) {
        // Network error or server issue, allow access but log the error
        console.warn('Token validation failed due to network error:', error);
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    // Check authentication immediately
    checkAuth();

    // Set up interval to periodically check token validity
    const authCheckInterval = setInterval(() => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    }, 300000); // Check every 5 minutes

    return () => clearInterval(authCheckInterval);
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login redirect message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecting to login...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Return children if authenticated
  return children;
}
