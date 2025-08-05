"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/albums"); // ✅ Fetch all albums from API
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
      const res = await fetch(`http://localhost:8080/api/albums/${id}`, {
        method: "DELETE", // ✅ Delete album by ID
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
    const res = await fetch("http://localhost:8080/api/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    const formData = new FormData();
    formData.append("album_id", selectedAlbumId);

    imageFiles.forEach((file, index) => {
      formData.append("images", file);
      // ✅ Set cover flag for the selected image index only
      formData.append(`is_cover_${index}`, index === coverImageIndex);
    });

    try {
      const res = await fetch("/api/images", {
        method: "POST", // ✅ Upload multiple images
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload images");
      toast.success("Images uploaded successfully");
      setImageFiles([]);
      setCoverImageIndex(null);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
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
      <li key={album.albumId} className="flex items-center justify-between px-4 py-2 border rounded hover:bg-gray-50">
        <span>{album.albumName}</span>
        <Button variant="destructive" size="sm" onClick={() => handleDeleteAlbum(album.albumId)}>
          Delete
        </Button>
      </li>
    ))}
  </ul>
</TabsContent>

        <TabsContent value="album">
          <form onSubmit={handleCreateAlbum} className="space-y-4">
            <div>
              <Label>Album Name</Label>
              <Input value={albumName} onChange={(e) => setAlbumName(e.target.value)} required />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={isActive} onCheckedChange={() => setIsActive(!isActive)} />
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

            <Label>Upload Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
            />

            {/* ✅ Mark one image as cover */}
            {imageFiles.length > 0 && (
              <div className="space-y-2">
                {imageFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={coverImageIndex === index}
                      onCheckedChange={() => setCoverImageIndex(index)}
                    />
                    <Label>{file.name}</Label>
                  </div>
                ))}
              </div>
            )}

            <Button type="submit">Upload Images</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
