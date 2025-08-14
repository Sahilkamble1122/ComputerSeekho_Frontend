# Placement Data Fetching Setup

This document explains how to set up the placement data fetching from your Spring Boot backend database.

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env.local` file in your project root with:

```bash
# Backend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Note:** Replace `8080` with your actual Spring Boot backend port.

### 2. Backend API Endpoints Required

Your Spring Boot backend needs to provide these endpoints:

#### `/api/batches` (GET)
Returns all batches with structure:
```json
[
  {
    "id": 1,
    "courseName": "PG DBDA",
    "batchName": "Aug 2024",
    "slug": "pg-dbda-aug-2024",
    "logoFileName": "dbda-aug-2024.png",
    "totalStudents": 40,
    "students": [
      {
        "id": 1,
        "name": "John Doe",
        "isPlaced": true
      }
    ]
  }
]
```

#### `/api/placements` (GET)
Returns placement data for batches:
```json
[
  {
    "batchId": 1,
    "placedStudents": 36,
    "totalStudents": 40
  }
]
```

## 🔧 Implementation Details

### Frontend Changes Made

1. **Updated `lib/config.js`** - Added placement endpoints
2. **Updated `lib/utils.js`** - Added `fetchPlacementData()` function
3. **Updated `app/api/placements/route.js`** - Now fetches from backend
4. **Updated `app/placements/page.jsx`** - Added loading states and error handling

### Data Flow

```
Frontend → /api/placements → Spring Boot Backend → Database
```

### Fallback Behavior

If the backend is unavailable, the system falls back to mock data to ensure the UI remains functional.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Spring Boot backend allows requests from your frontend domain
2. **Connection Refused**: Check if your backend is running and the port is correct
3. **Data Not Loading**: Check browser console for API errors

### Debug Steps

1. Check browser Network tab for failed API calls
2. Verify backend endpoints are working (test with Postman/curl)
3. Check environment variable `NEXT_PUBLIC_API_URL` is set correctly
4. Ensure backend returns data in expected format

## 📝 Backend Implementation Example

Here's a basic Spring Boot controller structure you might need:

```java
@RestController
@RequestMapping("/api")
public class PlacementController {
    
    @GetMapping("/batches")
    public List<Batch> getAllBatches() {
        // Return all batches with student count
    }
    
    @GetMapping("/placements")
    public List<PlacementData> getPlacementData() {
        // Return placement statistics for each batch
    }
}
```

## ✅ Testing

1. Start your Spring Boot backend
2. Set the correct `NEXT_PUBLIC_API_URL` in `.env.local`
3. Restart your Next.js development server
4. Navigate to `/placements` page
5. Check if data loads from backend

## 🔄 Data Refresh

The placement data automatically refreshes when:
- Page loads
- User navigates to the page
- Component remounts

For real-time updates, consider implementing WebSocket or Server-Sent Events.
