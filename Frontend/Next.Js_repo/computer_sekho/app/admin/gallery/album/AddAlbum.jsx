import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';

const AddAlbum = ({ onSubmit }) => {
  const [form, setForm] = useState({
    album_name: '',
    album_description: '',
    start_date: '',
    end_date: '',
    album_is_active: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.album_name || !form.start_date || !form.end_date) return;
    onSubmit(form);
    setForm({
      album_name: '',
      album_description: '',
      start_date: '',
      end_date: '',
      album_is_active: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-xl w-full">
      <h2 className="text-xl font-semibold mb-2">Create New Album</h2>

      <div>
        <Label htmlFor="album_name">Album Name</Label>
        <Input id="album_name" name="album_name" value={form.album_name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="album_description">Description</Label>
        <Textarea id="album_description" name="album_description" value={form.album_description} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="album_is_active" name="album_is_active" checked={form.album_is_active} onChange={handleChange} />
        <Label htmlFor="album_is_active">Active</Label>
      </div>

      <Button type="submit">Add Album</Button>
    </form>
  );
};

export default AddAlbum;
