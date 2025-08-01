"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

export default function AddImage() {
  const [albums, setAlbums] = useState([]);
  const [albumId, setAlbumId] = useState("");
  const [image, setImage] = useState(null);
  const [isCover, setIsCover] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    axios.get("/api/albums")
      .then(res => setAlbums(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("album_id", albumId);
    formData.append("image", image);
    formData.append("is_album_cover", isCover);
    formData.append("image_is_active", isActive);

    try {
      await axios.post("/api/images", formData);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Image upload failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-xl font-bold">Add New Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <Label>Select Album</Label>
          <Select onValueChange={setAlbumId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose album" />
            </SelectTrigger>
            <SelectContent>
              {albums.map(album => (
                <SelectItem key={album.album_id} value={album.album_id.toString()}>
                  {album.album_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Choose Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} required />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox checked={isCover} onCheckedChange={() => setIsCover(!isCover)} />
          <Label>Mark as Album Cover</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox checked={isActive} onCheckedChange={() => setIsActive(!isActive)} />
          <Label>Active</Label>
        </div>

        <Button type="submit">Upload Image</Button>
      </form>
    </div>
  );
}
