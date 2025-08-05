"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./components/ui/skeleton";
import AlbumCard from "./components/AlbumCard";
import Pagination from "./components/Pagination";

export default function GalleryPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/albums?page=${page}&limit=8`); // 🔁 Replace with actual API
        const data = await res.json();

        if (data?.albums?.length > 0) {
          setAlbums(data.albums);
          setHasMore(data.albums.length === 8);
        } else {
          setAlbums([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch albums", error);
        setAlbums([]);
        setHasMore(false);
      }
      setLoading(false);
    };

    fetchAlbums();
  }, [page]);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
        Photo Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-lg" />
            ))
          : albums.length > 0
          ? albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => router.push(`/gallery/${album.id}`)}
              />
            ))
          : <p className="text-gray-500 text-center col-span-full">No albums found.</p>}
      </div>

      <Pagination
        page={page}
        hasMore={hasMore}
        onPrev={prevPage}
        onNext={nextPage}
      />
    </div>
  );
}
