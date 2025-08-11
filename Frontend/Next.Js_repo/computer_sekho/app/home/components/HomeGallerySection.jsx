"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomeGallerySection() {
  const [albums, setAlbums] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/albums") // Use relative path to our Next.js API
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data.slice(0, 3)); // Top 3
      })
      .catch((err) => console.error("Error fetching albums", err));
  }, []);

  const getImageUrl = (album) => {
    console.log("Album data for image URL:", album); // Debug log
    
    // Check if album has a cover image from the images table
    if (album.coverImage) {
      console.log("Using coverImage:", album.coverImage);
      return album.coverImage;
    }
    
    // Fallback to coverPhoto if it exists (legacy support)
    if (album.coverPhoto?.startsWith("http")) {
      console.log("Using coverPhoto (http):", album.coverPhoto);
      return album.coverPhoto;
    }
    if (album.coverPhoto?.startsWith("/images/")) {
      console.log("Using coverPhoto (/images/):", album.coverPhoto);
      return album.coverPhoto;
    }
    if (album.coverPhoto) {
      console.log("Using coverPhoto (relative):", `/images/${album.coverPhoto}`);
      return `/images/${album.coverPhoto}`;
    }
    
    // Default fallback
    console.log("Using default image");
    return "/default-profile.png";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
        Gallery
      </h2>

      {albums.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.albumId}
                onClick={() => router.push(`/gallery/${album.albumId}`)}
                className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={getImageUrl(album)}
                    alt={album.albumName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold">{album.albumName}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {album.albumDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              See All Albums
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
