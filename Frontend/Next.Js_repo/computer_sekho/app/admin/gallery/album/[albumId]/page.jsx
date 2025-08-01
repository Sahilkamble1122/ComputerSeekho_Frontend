"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddImage() {
  const [albums, setAlbums] = useState([]);
  const [albumId, setAlbumId] = useState("");
  const [images, setImages] = useState([]);
  const [isCover, setIsCover] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // TODO: Replace '/api/albums' with your backend API endpoint to fetch albums
    fetch("/api/albums")
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((err) => console.error(err));
  }, []);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure album is selected
    if (!albumId) {
      alert("Please select an album.");
      return;
    }

    // Optional: Validate image file types (example: only image/*)
    for (const img of images) {
      if (!img.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("album_id", albumId);
    formData.append("is_album_cover", isCover);
    formData.append("image_is_active", isActive);

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      // TODO: Replace '/api/images' with your backend API endpoint to upload images
      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Image upload failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-xl font-bold">Add New Images</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Select Album</Label>
          <Select onValueChange={setAlbumId} required>
            <SelectTrigger>
              <SelectValue placeholder="Choose album" />
            </SelectTrigger>
            <SelectContent>
              {albums.map((album) => (
                <SelectItem
                  key={album.album_id}
                  value={album.album_id.toString()}
                >
                  {album.album_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Choose Images</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={isCover}
            onCheckedChange={() => setIsCover(!isCover)}
          />
          <Label>Mark as Album Cover</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={isActive}
            onCheckedChange={() => setIsActive(!isActive)}
          />
          <Label>Active</Label>
        </div>

        <Button type="submit">Upload Images</Button>
      </form>
    </div>
  );
}
