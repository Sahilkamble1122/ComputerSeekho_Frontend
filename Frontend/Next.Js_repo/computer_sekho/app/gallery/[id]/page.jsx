"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageGallery from "../components/ImageGallery";

export default function AlbumDetailsPage() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [albumTitle, setAlbumTitle] = useState("Album Images");

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/albums/${id}?page=${page}&limit=16`); // 🔁 Update when backend ready
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

      {/* ✅ Using reusable ImageGallery */}
      <ImageGallery images={images} loading={loading} />

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <Button variant="outline" disabled={page === 1} onClick={prevPage}>
          Previous
        </Button>
        <Button variant="outline" disabled={!hasMore} onClick={nextPage}>
          Next
        </Button>
      </div>
    </div>
  );
}
