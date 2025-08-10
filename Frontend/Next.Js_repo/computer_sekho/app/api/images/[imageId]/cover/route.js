import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { imageId } = params;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // First, get the current image to know which album it belongs to
    const token = request.headers.get('authorization');
    const getResponse = await fetch(`http://localhost:8080/api/images/${imageId}`, {
      headers: {
        'Authorization': token || ''
      }
    });

    if (!getResponse.ok) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    const currentImage = await getResponse.json();
    const albumId = currentImage.albumId;

    // Get all images in the album to reset their cover status
    const albumImagesResponse = await fetch(`http://localhost:8080/api/images/search/album/${albumId}`, {
      headers: {
        'Authorization': token || ''
      }
    });

    if (albumImagesResponse.ok) {
      const albumImages = await albumImagesResponse.json();
      
      // Reset all images in the album to not be cover
      for (const image of albumImages) {
        if (image.imageId !== parseInt(imageId)) {
          await fetch(`http://localhost:8080/api/images/${image.imageId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token || ''
            },
            body: JSON.stringify({ isAlbumCover: false })
          });
        }
      }
    }

    // Set the selected image as cover
    const updateResponse = await fetch(`http://localhost:8080/api/images/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      body: JSON.stringify({ isAlbumCover: true })
    });

    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to set image as cover' },
        { status: 500 }
      );
    }

    const updatedImage = await updateResponse.json();
    return NextResponse.json(updatedImage);

  } catch (error) {
    console.error('Error setting cover image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
