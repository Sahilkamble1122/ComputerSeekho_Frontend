import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request, { params }) {
  try {
    const { imageId } = params;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // First, get the image details from database to know the file path
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

    const imageData = await getResponse.json();
    const imagePath = imageData.imagePath;

    // Delete from database first
    const deleteResponse = await fetch(`http://localhost:8080/api/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token || ''
      }
    });

    if (!deleteResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to delete image from database' },
        { status: 500 }
      );
    }

    // If database deletion successful, delete the physical file
    if (imagePath && !imagePath.startsWith('http')) {
      try {
        const fullPath = join(process.cwd(), 'public', imagePath);
        await unlink(fullPath);
      } catch (fileError) {
        console.error('Error deleting physical file:', fileError);
        // Don't fail the request if file deletion fails
      }
    }

    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { imageId } = params;
    const { isAlbumCover } = await request.json();

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Update the image in database
    const token = request.headers.get('authorization');
    const response = await fetch(`http://localhost:8080/api/images/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      body: JSON.stringify({ isAlbumCover })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update image' },
        { status: 500 }
      );
    }

    const updatedImage = await response.json();
    return NextResponse.json(updatedImage);

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
