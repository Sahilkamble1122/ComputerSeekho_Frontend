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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    if (albumId) fetchImages();
  }, [albumId]);

  const fetchImages = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/images?albumId=${albumId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        if (res.status === 503) {
          throw new Error(errorData.error || 'Backend service unavailable. Please check if the Spring Boot application is running.');
        } else if (res.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (res.status === 400) {
          throw new Error(errorData.error || 'Invalid request. Album ID is required.');
        } else {
          throw new Error(errorData.error || `Failed to fetch images (Status: ${res.status})`);
        }
      }
      
      const data = await res.json();
      

      
      const coverFirst = [...data].sort((a, b) => b.isAlbumCover - a.isAlbumCover);
      setImages(coverFirst);
    } catch (err) {
      console.error('Error fetching images:', err);
      toast.error(err.message || "Failed to fetch images");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/images/${imageId}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Delete failed');
      }
      
      toast.success("Image deleted");
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Delete failed");
    }
  };

  const handleSetCover = async (imageId) => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/images/${imageId}/cover`, { 
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to set cover');
      }
      
      toast.success("Cover updated");
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to set cover");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Album Images</h2>

        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => fetchImages(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "🔄 Refresh"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg">Loading images...</div>
        </div>
      ) : images.length === 0 ? (
        <p>No images in this album.</p>
      ) : (
        <>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Total Images: {images.length}</p>
                <p className="text-sm text-gray-600">
                  Cover Image: {images.find(img => img.isAlbumCover)?.imagePath || 'None selected'}
                </p>

              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.imageId} className="relative border p-2 rounded shadow-sm">
                <Image
                  src={`/${img.imagePath}`}
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleSetCover(img.imageId)}
                  >
                    Set as Cover
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteImage(img.imageId)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
