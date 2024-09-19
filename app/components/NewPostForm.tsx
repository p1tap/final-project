"use client";
import { useState, useRef } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { useAuth } from '../contexts/AuthContext';
import { toast } from "react-toastify";
import ImageIcon from '@mui/icons-material/Image';

export default function NewPostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', user?.id || '');
      if (image) {
        formData.append('postImage', image);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        toast.success('Post created successfully');
        setContent("");
        setImage(null);
        // Trigger a re-render of the parent component
        window.dispatchEvent(new CustomEvent('newpost'));
      } else {
        const errorData = await response.json();
        console.error("Failed to create post:", errorData);
        toast.error('Failed to create post');
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error('Error creating post');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        rows={3}
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <IconButton onClick={() => fileInputRef.current?.click()}>
          <ImageIcon />
        </IconButton>
        <Button
          type="submit"
          variant="contained"
        >
          Post
        </Button>
      </Box>
      {image && (
        <Box sx={{ mt: 2 }}>
          <img src={URL.createObjectURL(image)} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        </Box>
      )}
    </Box>
  );
}