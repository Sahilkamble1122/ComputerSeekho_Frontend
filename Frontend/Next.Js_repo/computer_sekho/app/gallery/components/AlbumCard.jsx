// app/gallery/components/AlbumCard.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AlbumCard({ id, title, description, coverImage }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = () => {
    router.push(`/gallery/${id}`); // Navigate to album details page
  };

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <CardContent className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(coverImage);
                }}
              />
            ) : (
              <div
                className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md mb-4 flex items-center justify-center text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">No Cover Image</p>
                </div>
              </div>
            )}
          </DialogTrigger>
          <DialogContent className="w-full max-w-3xl p-0 bg-transparent border-none shadow-none">
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Zoomed"
                width={800}
                height={600}
                className="w-full h-auto rounded-md"
              />
            )}
          </DialogContent>
        </Dialog>

        <h2 className="text-xl font-semibold text-blue-900 mb-2 truncate">
          {title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {description || "No description available."}
        </p>
      </CardContent>
    </Card>
  );
}

