// app/gallery/components/AlbumCard.jsx
"use client";

import { useRouter } from "next/navigation";

export default function AlbumCard({ id, title, description, coverImage }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/gallery/${id}`); // Navigate to album details page
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 h-full">
      {/* Cover Image */}
      <div className="h-64 w-full overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">No Cover Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Album Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-sm flex-1 line-clamp-3 mb-4">
          {description || "No description available."}
        </p>
        <div className="mt-auto">
          <button
            onClick={handleClick}
            className="inline-block bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition cursor-pointer font-medium"
          >
            View Album
          </button>
        </div>
      </div>
    </div>
  );
}

