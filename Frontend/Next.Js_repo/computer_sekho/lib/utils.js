import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
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