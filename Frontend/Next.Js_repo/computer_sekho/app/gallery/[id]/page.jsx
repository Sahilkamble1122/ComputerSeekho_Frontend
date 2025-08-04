"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function AlbumDetailsPage() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [albumTitle, setAlbumTitle] = useState("Album Images");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/albums/${id}?page=${page}&limit=16`); // 🔁 Update API when backend ready
        const data = await res.json();

        if (data?.images?.length > 0) {
          setImages(data.images);
          setAlbumTitle(data.albumTitle || "Album Images");
          setHasMore(data.images.length === 16);
        } else {
          setImages([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to load images", error);
        setImages([]);
        setHasMore(false);
      }
      setLoading(false);
    };

    fetchImages();
  }, [id, page]);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return (
    <div className="p-6">
      <Link
        href="/gallery"
        className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 inline-block"
      >
        ← Back to Gallery
      </Link>

      <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        {albumTitle}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 justify-items-center">
        {loading
          ? Array.from({ length: 16 }).map((_, i) => (
              <Skeleton key={i} className="w-40 h-28 rounded" />
            ))
          : images.length > 0
          ? images.map((img, i) => (
              <div key={i} className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Image
                      src={img.url}
                      alt={img.caption || `Image ${i}`}
                      width={200}
                      height={140}
                      className="rounded object-cover w-full h-36 cursor-pointer"
                      onClick={() => setSelectedImage(img)}
                    />
                  </DialogTrigger>
                  <DialogContent className="flex justify-center items-center">
                    <Image
                      src={img.url}
                      alt={img.caption || `Full Image ${i}`}
                      width={800}
                      height={500}
                      className="rounded object-contain max-h-[90vh] w-auto"
                    />
                  </DialogContent>
                </Dialog>
                {img.caption && (
                  <p className="text-xs text-gray-500 mt-1">{img.caption}</p>
                )}
              </div>
            ))
          : <p className="col-span-full text-gray-500 text-center">No images found.</p>}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={prevPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!hasMore}
          onClick={nextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
