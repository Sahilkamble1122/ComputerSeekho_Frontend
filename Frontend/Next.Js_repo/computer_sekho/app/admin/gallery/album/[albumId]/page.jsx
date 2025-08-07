"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AlbumImagesPage() {
  const { albumId } = useParams();
  const router = useRouter();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (albumId) fetchImages();
  }, [albumId]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/images?albumId=${albumId}`);
      const data = await res.json();
      const coverFirst = [...data].sort((a, b) => b.isAlbumCover - a.isAlbumCover);
      setImages(coverFirst);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch images");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Image deleted");
      fetchImages();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSetCover = async (imageId) => {
    try {
      const res = await fetch(`/api/images/${imageId}/cover`, { method: "PUT" });
      if (!res.ok) throw new Error();
      toast.success("Cover updated");
      fetchImages();
    } catch {
      toast.error("Failed to set cover");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Album Images</h2>
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      {images.length === 0 ? (
        <p>No images in this album.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.imageId} className="relative border p-2 rounded shadow-sm">
              <Image
                src={img.imagePath}
                alt="album image"
                width={400}
                height={300}
                className="rounded w-full h-auto object-cover"
              />
              {img.isAlbumCover && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-0.5 rounded">
                  Cover
                </span>
              )}
              <div className="mt-2 flex flex-col gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSetCover(img.imageId)}>
                  Set as Cover
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(img.imageId)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
