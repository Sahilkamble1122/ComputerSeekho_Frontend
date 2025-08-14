import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { API_CONFIG, getApiUrl } from "./config";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Fetches all placement data from the backend
 * @returns {Promise<Array>} - Array of placement data for all batches
 */
export async function fetchPlacementData() {
  try {
    const response = await fetch('/api/placements');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch placement data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching placement data:', error);
    throw error;
  }
}

/**
 * Updates a student's placement status
 * @param {number} studentId - The student's ID
 * @param {boolean} isPlaced - Whether the student is placed or not
 * @param {string} token - Authorization token
 * @returns {Promise<Object>} - The updated student data
 */
export async function updateStudentPlacementStatus(studentId, isPlaced, token) {
  const response = await fetch(
    `/api/students/${studentId}/isplaced?isPlaced=${encodeURIComponent(isPlaced)}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update placement status: ${errorText}`);
  }

  return response.json();
}