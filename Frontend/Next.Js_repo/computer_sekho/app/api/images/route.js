import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const albumId = formData.get('albumId');
    const files = formData.getAll('images');
    const coverImageIndex = parseInt(formData.get('coverImageIndex') || '0');

    if (!albumId || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'Album ID and images are required' },
        { status: 400 }
      );
    }

    const uploadedImages = [];
    const imagesDir = join(process.cwd(), 'public', 'images');

    // Create images directory if it doesn't exist
    try {
      await mkdir(imagesDir, { recursive: true });
    } catch (error) {
      console.error('Error creating images directory:', error);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file || !(file instanceof File)) {
        continue;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${randomString}.${fileExtension}`;
      
      // Save file to public/images folder
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(imagesDir, fileName);
      
      try {
        await writeFile(filePath, buffer);
        
        // Prepare image data for database
        const imageData = {
          imagePath: `images/${fileName}`,
          albumId: parseInt(albumId),
          isAlbumCover: i === coverImageIndex,
          imageIsActive: true
        };

        // Save to database via your Spring Boot API
        const token = request.headers.get('authorization');
        const dbResponse = await fetch('http://localhost:8080/api/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token || ''
          },
          body: JSON.stringify(imageData)
        });

        if (dbResponse.ok) {
          const savedImage = await dbResponse.json();
          uploadedImages.push(savedImage);
        } else {
          console.error(`Failed to save image ${fileName} to database`);
        }
      } catch (error) {
        console.error(`Error saving file ${fileName}:`, error);
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: 'Failed to upload any images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploadedImages.length} images`,
      images: uploadedImages
    });

  } catch (error) {
    console.error('Error in image upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');

    if (!albumId) {
      return NextResponse.json(
        { error: 'Album ID is required' },
        { status: 400 }
      );
    }

    // Fetch images from your Spring Boot API
    const token = request.headers.get('authorization');
    
    try {
      // Get all images from Spring Boot backend and filter by album ID
      const response = await fetch(`http://localhost:8080/api/images`, {
        headers: {
          'Authorization': token || ''
        }
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const allImages = await response.json();
      
      // Filter images by album ID
      const filteredImages = allImages.filter(img => img.albumId === parseInt(albumId));
      
      return NextResponse.json(filteredImages);
      
    } catch (fetchError) {
      console.error('Error connecting to Spring Boot backend:', fetchError.message);
      return NextResponse.json(
        { error: 'Failed to fetch images from backend' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error in GET /api/images:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
