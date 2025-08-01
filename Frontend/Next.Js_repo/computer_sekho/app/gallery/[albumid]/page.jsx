'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AlbumImages() {
  const { albumId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`/api/gallery/images?album_id=${albumId}`)
      .then(res => res.json())
      .then(setImages);
  }, [albumId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Album Images</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <img
            key={img.id}
            src={`/${img.image_url}`}
            alt={img.caption}
            className="w-full h-40 object-cover rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}
