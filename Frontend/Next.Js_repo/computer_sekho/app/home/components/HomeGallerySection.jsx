"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    // Check if album has a cover image from the images table
    if (album.coverImage) {
      return album.coverImage;
    }
    
    // Fallback to coverPhoto if it exists (legacy support)
    if (album.coverPhoto?.startsWith("http")) {
      return album.coverPhoto;
    }
    if (album.coverPhoto?.startsWith("/images/")) {
      return album.coverPhoto;
    }
    if (album.coverPhoto) {
      return `/images/${album.coverPhoto}`;
    }
    
    // Default fallback
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {albums.map((album) => (
              <div
                key={album.albumId}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Cover Image */}
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={getImageUrl(album)}
                    alt={album.albumName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Album Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    {album.albumName}
                  </h3>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3">
                    {album.albumDescription || "No description available."}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push(`/gallery/${album.albumId}`)}
                      className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
                    >
                      View Album
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See All Button */}
          <div className="text-center mt-10">
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
