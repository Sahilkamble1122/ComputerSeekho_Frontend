
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AlbumList() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch('/api/gallery/albums')
      .then(res => res.json())
      .then(setAlbums);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {albums.map(album => (
          <Link
            key={album.id}
            href={`/admin/gallery/${album.id}`}
            className="block bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={`/${album.cover_image || 'default-cover.jpg'}`}
              className="w-full h-40 object-cover"
              alt={album.title}
            />
            <div className="p-3 font-semibold text-center">{album.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
