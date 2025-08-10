import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '8';

    // Fetch albums from Spring Boot backend
    const albumsResponse = await fetch(`http://localhost:8080/api/albums?page=${page}&limit=${limit}`);
    
    if (!albumsResponse.ok) {
      throw new Error(`Backend error: ${albumsResponse.status}`);
    }

    const albums = await albumsResponse.json();

    // Fetch all images to get cover images
    let allImages = [];
    try {
      const imagesResponse = await fetch('http://localhost:8080/api/images');
      
      if (imagesResponse.ok) {
        allImages = await imagesResponse.json();
      } else {
        console.warn(`Images backend error: ${imagesResponse.status}, proceeding without cover images`);
      }
    } catch (error) {
      console.warn('Failed to fetch images, proceeding without cover images:', error.message);
    }

    // Enhance albums with cover images
    const albumsWithCovers = albums.map(album => {
      // Find the cover image for this album
      const coverImage = allImages.find(img => 
        img.albumId === album.albumId && img.isAlbumCover === true
      );

      return {
        ...album,
        coverImage: coverImage ? `/images/${coverImage.imagePath.split('/').pop()}` : null
      };
    });

    return NextResponse.json(albumsWithCovers);

  } catch (error) {
    console.error('Error in GET /api/albums:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch albums with cover images',
        details: error.message
      },
      { status: 500 }
    );
  }
}
