"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AlbumCard from "./components/AlbumCard";
import Pagination from "./components/Pagination";
import Navcomponent from "../home/components/Navcomponent";
import Footer from "../footer/components/Footer";

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
        const res = await fetch(
          `http://localhost:8080/api/albums?page=${page}&limit=8`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setAlbums(data); // ✅ FIXED HERE
          setHasMore(data.length === 8);
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
    <>
      <Navcomponent />
      <div className="p-6 pt-[150px]">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          Photo Gallery
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-lg" />
            ))
          ) : albums.length > 0 ? (
            albums.map((album) => (
              <AlbumCard
                key={album.albumId}
                album={album}
                onClick={() => router.push(`/gallery/${album.albumId}`)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No albums found.
            </p>
          )}
        </div>

        <Pagination
          page={page}
          hasMore={hasMore}
          onPrev={prevPage}
          onNext={nextPage}
        />
      </div>
      <Footer />
    </>
  );
}
