"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AlbumCard from "./AlbumCard";

export default function AlbumList() {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/albums?page=${page}&limit=8`);
        const data = await res.json();

        if (data?.albums?.length > 0) {
          setAlbums(data.albums);
          setHasMore(data.albums.length === 8);
        } else {
          setAlbums([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching albums", error);
        setAlbums([]);
        setHasMore(false);
      }
      setLoading(false);
    };

    fetchAlbums();
  }, [page]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
              coverImage={album?.coverImage}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No albums found.
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
