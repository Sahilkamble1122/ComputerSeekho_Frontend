import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '16';

    // Fetch album details from Spring Boot backend
    const albumResponse = await fetch(`http://localhost:8080/api/albums/${id}`);
    
    if (!albumResponse.ok) {
      throw new Error(`Album not found: ${albumResponse.status}`);
    }

    const album = await albumResponse.json();

    // Fetch all images for this album
    const imagesResponse = await fetch('http://localhost:8080/api/images');
    
    if (!imagesResponse.ok) {
      throw new Error(`Images backend error: ${imagesResponse.status}`);
    }

    const allImages = await imagesResponse.json();
    
    // Filter images by album ID and convert to the format expected by ImageGallery
    const albumImages = allImages
      .filter(img => img.albumId === parseInt(id))
      .map(img => ({
        id: img.imageId,
        url: `/images/${img.imagePath.split('/').pop()}`,
        caption: img.imageCaption || null,
        isCover: img.isAlbumCover,
        createdAt: img.createdDate
      }))
      .sort((a, b) => {
        // Put cover image first, then sort by creation date
        if (a.isCover && !b.isCover) return -1;
        if (!a.isCover && b.isCover) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedImages = albumImages.slice(startIndex, endIndex);

    return NextResponse.json({
      albumTitle: album.albumName,
      albumDescription: album.albumDescription,
      totalImages: albumImages.length,
      images: paginatedImages,
      hasMore: endIndex < albumImages.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(albumImages.length / parseInt(limit))
    });

  } catch (error) {
    console.error('Error in GET /api/albums/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch album images',
        details: error.message
      },
      { status: 500 }
    );
  }
}
