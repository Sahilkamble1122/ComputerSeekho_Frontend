"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import ImageGallery from "../components/ImageGallery";
import Navcomponent from "@/app/home/components/Navcomponent";
import Footer from "@/app/footer/components/Footer";

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
        const res = await fetch(`/api/albums/${id}?page=${page}&limit=16`);
        const data = await res.json();

        if (data?.images?.length > 0) {
          setImages(data.images);
          setAlbumTitle(data.albumTitle || "Album Images");
          setHasMore(data.hasMore);
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
    <>
      <Navcomponent />
      <div className="p-6 pt-[150px]">
        <Link
          href="/gallery"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 inline-block"
        >
          ← Back to Gallery
        </Link>

        <h1 className="text-2xl font-bold text-blue-900 mb-2 text-center">
          {albumTitle}
        </h1>
        {images.length > 0 && (
          <p className="text-gray-600 text-center mb-6">
            {images.length} image{images.length !== 1 ? 's' : ''} in this album
          </p>
        )}

        {/* ✅ Using reusable ImageGallery */}
        <ImageGallery images={images} loading={loading} />

        {/* Pagination Controls - Only show if there are images */}
        {!loading && images.length > 0 && (
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" disabled={page === 1} onClick={prevPage}>
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              Page {page}
            </span>
            <Button variant="outline" disabled={!hasMore} onClick={nextPage}>
              Next
            </Button>
          </div>
        )}

        {/* Show message when no images */}
        {!loading && images.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
