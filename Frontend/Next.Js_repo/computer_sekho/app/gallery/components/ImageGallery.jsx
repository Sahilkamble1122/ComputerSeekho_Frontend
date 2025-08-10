"use client";

import Image from "next/image";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImageGallery({ images, loading }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 justify-items-center">
      {loading
        ? Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="w-40 h-28 rounded" />
          ))
        : images.length > 0
        ? images.map((img, i) => (
            <div key={img.id || i} className="text-center group">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={img.url}
                      alt={img.caption || `Image ${i + 1}`}
                      width={200}
                      height={140}
                      className="rounded object-cover w-full h-36 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    />
                    {img.isCover && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        Cover
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="flex justify-center items-center max-w-4xl">
                  <Image
                    src={img.url}
                    alt={img.caption || `Full Image ${i + 1}`}
                    width={800}
                    height={500}
                    className="rounded object-contain max-h-[90vh] w-auto"
                  />
                </DialogContent>
              </Dialog>
              {img.caption && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{img.caption}</p>
              )}
            </div>
          ))
        : (
          <p className="col-span-full text-gray-500 text-center">
            No images found.
          </p>
        )}
    </div>
  );
}
