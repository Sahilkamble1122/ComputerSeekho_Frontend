# Gallery Image Upload System

This document describes the implementation of the multiple image upload functionality for the Admin Gallery system.

## Features

### 1. Multiple Image Upload
- Upload multiple images at once to a specific album
- Support for JPEG, PNG, GIF, and WebP formats
- Maximum file size: 5MB per image
- Automatic file validation and error handling

### 2. Album Cover Selection
- One image per album can be marked as the cover photo
- Visual indicator shows which image is currently the cover
- Automatic cover management (only one cover per album)

### 3. File Management
- Images are stored in `public/images/` folder
- Unique filename generation to prevent conflicts
- Database integration with Spring Boot backend
- Automatic cleanup of physical files when images are deleted

## API Endpoints

### POST `/api/images`
Uploads multiple images to an album.

**Request Body (FormData):**
- `albumId`: ID of the target album
- `images`: Array of image files
- `coverImageIndex`: Index of the image to be set as cover

**Response:**
```json
{
  "message": "Successfully uploaded X images",
  "images": [...]
}
```

### GET `/api/images?albumId={id}`
Fetches all images for a specific album.

### DELETE `/api/images/{imageId}`
Deletes an image from both database and file system.

### PUT `/api/images/{imageId}/cover`
Sets an image as the album cover (automatically unsets others).

## Database Schema

The system expects the following JSON structure from the Spring Boot API:

```json
{
  "imageId": 1,
  "imagePath": "images/filename.jpg",
  "albumId": 1,
  "isAlbumCover": false,
  "imageIsActive": true,
  "createdDate": "2025-07-29T01:23:27",
  "updatedDate": "2025-07-29T01:23:27"
}
```

## File Storage

- **Location**: `public/images/`
- **Naming Convention**: `{timestamp}_{randomString}.{extension}`
- **Example**: `1754758417049_9zjv7i.png`

## Usage Instructions

### For Administrators

1. **Navigate to Gallery Management**
   - Go to `/admin/gallery/album`

2. **Create an Album** (if needed)
   - Fill in album details
   - Set start and end dates
   - Mark as active/inactive

3. **Upload Images**
   - Select the target album from dropdown
   - Choose multiple image files
   - Select one image as the cover photo
   - Click "Upload Images"

4. **Manage Images**
   - View uploaded images in the album
   - Change cover image if needed
   - Delete unwanted images

### Image Requirements

- **Formats**: JPEG, JPG, PNG, GIF, WebP
- **Size**: Maximum 5MB per file
- **Cover**: Must select one image as cover before upload

## Error Handling

The system provides comprehensive error handling for:
- Invalid file types
- File size limits
- Missing album selection
- Missing cover image selection
- Upload failures
- Database errors

## Security Features

- JWT token authentication required
- File type validation
- File size restrictions
- Secure filename generation
- Proper error messages without exposing system details

## Technical Implementation

### Frontend Components
- **Album Management**: Create, view, and delete albums
- **Image Upload**: Multi-file upload with preview
- **Image Gallery**: View and manage album images
- **Cover Selection**: Visual cover image management

### Backend Integration
- **File Storage**: Local file system with Next.js API routes
- **Database**: Spring Boot REST API integration
- **Authentication**: JWT token-based security
- **Error Handling**: Comprehensive error management

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check file size (max 5MB)
   - Verify file format (JPEG, PNG, GIF, WebP)
   - Ensure album is selected
   - Verify cover image is selected

2. **Images Not Displaying**
   - Check file paths in database
   - Verify `public/images/` directory exists
   - Check file permissions

3. **Cover Image Issues**
   - Only one image can be cover per album
   - Cover selection is required before upload

### Debug Information

- Check browser console for JavaScript errors
- Verify API responses in Network tab
- Check server logs for backend errors
- Ensure proper JWT token authentication

## Future Enhancements

- Image compression and optimization
- Bulk image operations
- Image metadata editing
- Advanced search and filtering
- Image categories and tags
- Cloud storage integration
