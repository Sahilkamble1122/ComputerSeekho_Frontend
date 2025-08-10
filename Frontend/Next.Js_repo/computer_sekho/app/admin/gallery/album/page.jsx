"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function AddAlbum() {
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [albums, setAlbums] = useState([]);

  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(null); // Track index of cover image
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://localhost:8080/api/albums", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }); // ✅ Fetch all albums from API
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch albums");
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/albums/${id}`, {
        method: "DELETE", // ✅ Delete album by ID
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Album deleted");
      fetchAlbums(); // ✅ Refresh album list after deletion
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete album");
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();

    if (!albumName || !startDate || !endDate) {
      return toast.error("Please fill in all required fields");
    }

    if (new Date(startDate) > new Date(endDate)) {
      return toast.error("Start date cannot be after end date");
    }

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch("http://localhost:8080/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          albumName: albumName,
          albumDescription: description,
          startDate: `${startDate}T00:00:00`,
          endDate: `${endDate}T00:00:00`,
          albumIsActive: isActive,
        }),
      });

      if (!res.ok) throw new Error("Album creation failed");
      toast.success("Album created successfully");

      setAlbumName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setIsActive(true);
      fetchAlbums();
    } catch (err) {
      console.error(err);
      toast.error("Album creation failed");
    }
  };
  const handleAddImages = async (e) => {
    e.preventDefault();
    if (!selectedAlbumId || imageFiles.length === 0) {
      return toast.error("Please select album and upload images");
    }

    if (coverImageIndex === null) {
      return toast.error("Please select a cover image");
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = imageFiles.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      return toast.error("Please upload only valid image files (JPEG, PNG, GIF, WebP)");
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = imageFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      return toast.error("Please upload images smaller than 5MB each");
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("albumId", selectedAlbumId);
      formData.append("coverImageIndex", coverImageIndex.toString());

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const token = sessionStorage.getItem('token');
      const res = await fetch("/api/images", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload images");
      }

      const result = await res.json();
      toast.success(result.message || "Images uploaded successfully");
      setImageFiles([]);
      setCoverImageIndex(null);
      setSelectedAlbumId("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const clearImageForm = () => {
    setImageFiles([]);
    setCoverImageIndex(null);
    setSelectedAlbumId("");
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    if (coverImageIndex === indexToRemove) {
      setCoverImageIndex(null);
    } else if (coverImageIndex > indexToRemove) {
      setCoverImageIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-xl font-bold">Gallery Management</h2>

      <Tabs defaultValue="view">
        <TabsList>
          <TabsTrigger value="view">Existing Albums</TabsTrigger>
          <TabsTrigger value="album">Add Album</TabsTrigger>
          <TabsTrigger value="images">Add Images</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <h3 className="text-lg font-semibold mb-4">Existing Albums</h3>
          <ul className="space-y-2">
            {albums.map((album) => (
              <li
                key={album.albumId}
                className="flex items-center justify-between px-4 py-2 border rounded hover:bg-gray-50"
              >
                <span>{album.albumName}</span>
                <div className="flex gap-2">
                  <Link href={`/admin/gallery/album/${album.albumId}`}>
                    <Button variant="outline" size="sm">
                      View Images
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAlbum(album.albumId)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="album">
          <form onSubmit={handleCreateAlbum} className="space-y-4">
            <div>
              <Label>Album Name</Label>
              <Input
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isActive}
                onCheckedChange={() => setIsActive(!isActive)}
              />
              <Label>Active</Label>
            </div>
            <Button type="submit">Create Album</Button>
          </form>
        </TabsContent>

        <TabsContent value="images">
          <form onSubmit={handleAddImages} className="space-y-4">
            <Label>Select Album</Label>
            <select
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              {albums.map((a) => (
                <option key={a.albumId} value={a.albumId}>
                  {a.albumName}
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <Label>Upload Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
              />
              <p className="text-sm text-gray-600">
                Supported formats: JPEG, PNG, GIF, WebP (Max 5MB per file)
              </p>
            </div>

            {/* Image previews and cover selection */}
            {imageFiles.length > 0 && (
              <div className="space-y-4">
                <Label>Select Cover Image (Required)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative border rounded-lg p-3">
                      <div className="aspect-square mb-2 relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                        />
                        {coverImageIndex === index && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-semibold">
                            Cover
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 left-2 w-6 h-6 p-0 text-xs"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`cover-${index}`}
                          checked={coverImageIndex === index}
                          onCheckedChange={() => setCoverImageIndex(index)}
                        />
                        <Label htmlFor={`cover-${index}`} className="text-sm truncate">
                          {file.name}
                        </Label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Images"}
              </Button>
              <Button type="button" variant="outline" onClick={clearImageForm}>
                Clear Form
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
