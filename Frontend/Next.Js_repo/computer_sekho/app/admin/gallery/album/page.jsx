"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AddAlbum() {
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/albums"); // TODO: Replace with actual API
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
      const res = await fetch(`/api/albums/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Album deleted");
      fetchAlbums();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete album");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!albumName || !startDate || !endDate) {
      return toast.error("Please fill in all required fields");
    }

    if (new Date(startDate) > new Date(endDate)) {
      return toast.error("Start date cannot be after end date");
    }

    try {
      const res = await fetch("/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          album_name: albumName,
          album_description: description,
          album_start_date: startDate,
          album_end_date: endDate,
          album_is_active: isActive,
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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <Tabs defaultValue="gallery">
        <TabsList className="mb-6">
          <TabsTrigger value="gallery">Albums</TabsTrigger>
          <TabsTrigger value="add">Add Album</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <h3 className="text-lg font-semibold mb-4">Existing Albums</h3>
          <ul className="space-y-2">
            {albums.map((album) => (
              <li
                key={album.album_id}
                className="flex items-center justify-between px-4 py-2 border rounded hover:bg-gray-50"
              >
                <span>{album.album_name}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAlbum(album.album_id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="add">
          <h2 className="text-xl font-bold mb-4">Add New Album</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
      </Tabs>
    </div>
  );
}

