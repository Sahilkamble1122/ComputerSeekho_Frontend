"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../footer/components/Footer";
import Navcomponent from "../home/components/Navcomponent";
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
        const res = await fetch(
          `/api/albums?page=${page}&limit=8`
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
        // You could add a toast notification here for user feedback
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
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          Photo Gallery
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-lg" />
            ))
          ) : albums.length > 0 ? (
            albums.map((album) => (
              <AlbumCard
                key={album.albumId}
                id={album.albumId}
                title={album.albumName}
                description={album.albumDescription}
                coverImage={album.coverImage}
                onClick={() => router.push(`/gallery/${album.albumId}`)}
              />
            ))
          ) : (
            <div className="text-center col-span-full py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No albums found.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new photo collections.</p>
            </div>
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
