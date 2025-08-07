// app/gallery/components/AlbumCard.jsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

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
                className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500"
                onClick={(e) => e.stopPropagation()}
              >
                No Image
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

