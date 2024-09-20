"use client";
import { useState, useRef } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { useAuth } from '../contexts/AuthContext';
import { toast } from "react-toastify";
import ImageIcon from '@mui/icons-material/Image';
import CircularProgress from '@mui/material/CircularProgress';
import Image from "next/image";

interface NewPostFormProps {
  onPostCreated?: () => void;
}

export default function NewPostForm({ onPostCreated }: NewPostFormProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPosting, setIsPosting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !image) {
      toast.error('Please add some content or an image to your post');
      return;
    }
    setIsPosting(true);
    try {
      const formData = new FormData();
      if (content) {
        formData.append('content', content);
      }
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
        window.dispatchEvent(new CustomEvent('newpost'));
  
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to create post:", errorData);
        toast.error('Failed to create post');
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error('Error creating post');
    } finally {
      setIsPosting(false);
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
          disabled={isPosting}
          startIcon={isPosting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </Button>
      </Box>
      {image && (
      <Box sx={{ mt: 2 }}>
        <Image
          src={URL.createObjectURL(image)}
          alt="Selected"
          width={200}
          height={200}
          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
        />
      </Box>
    )}
    </Box>
  );
}