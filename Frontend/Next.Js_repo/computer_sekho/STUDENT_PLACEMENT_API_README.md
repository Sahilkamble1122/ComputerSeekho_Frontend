# Student Placement API Documentation

## Overview
This document describes the API endpoint for updating student placement status in the Computer Seekho application.

## Backend Endpoint (Spring Boot)
```
PATCH /api/students/{studentId}/isplaced?isPlaced={boolean}
```

### Parameters
- `studentId` (path parameter): The unique identifier of the student
- `isPlaced` (query parameter): Boolean value indicating placement status (true/false)

### Response
- **Success (200)**: Returns the updated StudentMaster object
- **Not Found (404)**: Student not found
- **Internal Server Error (500)**: Server error

## Frontend API Route (Next.js)
```
PATCH /api/students/{studentId}/isplaced?isPlaced={boolean}
```

### Usage Example
```javascript
import { updateStudentPlacementStatus } from '@/lib/utils';

// Update student placement status
try {
  const token = sessionStorage.getItem('token');
  const updatedStudent = await updateStudentPlacementStatus(studentId, true, token);
  console.log('Student updated:', updatedStudent);
} catch (error) {
  console.error('Failed to update:', error.message);
}
```

### Direct Fetch Usage
```javascript
const response = await fetch(`/api/students/${studentId}/isplaced?isPlaced=${isPlaced}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

if (response.ok) {
  const updatedStudent = await response.json();
  // Handle success
} else {
  // Handle error
}
```

## Implementation Details

### 1. API Route File
- **Location**: `app/api/students/[studentId]/isplaced/route.js`
- **Method**: PATCH
- **Authentication**: Required (Bearer token)

### 2. Utility Function
- **Location**: `lib/utils.js`
- **Function**: `updateStudentPlacementStatus(studentId, isPlaced, token)`
- **Returns**: Promise with updated student data

### 3. Frontend Integration
- **Component**: `app/admin/placement/page.jsx`
- **Feature**: Toggle switch for updating placement status
- **State Management**: Local state updates for immediate UI feedback

## Error Handling
- **400**: Missing required parameters
- **401**: Unauthorized (missing or invalid token)
- **404**: Student not found
- **500**: Internal server error

## Security
- All requests require valid JWT token in Authorization header
- Token is retrieved from sessionStorage
- Backend validates token before processing request

## Testing
To test the API endpoint:

1. Ensure backend server is running on `http://localhost:8080`
2. Navigate to `/admin/placement` page
3. Use the toggle switch to change student placement status
4. Check browser network tab for API calls
5. Verify backend receives the request correctly

## Notes
- The API uses query parameters instead of request body for the `isPlaced` value
- Local state updates provide immediate UI feedback while API call is in progress
- Error handling includes user-friendly toast notifications
- The implementation follows the existing codebase patterns and conventions
