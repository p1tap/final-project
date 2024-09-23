"use client";
import React, { useState, useRef } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import { Post } from '../types';
import { toast } from 'react-toastify';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface EditPostFormProps {
  post: Post;
  onEditComplete: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post, onEditComplete }) => {
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      if (image) {
        // New image uploaded
        formData.append('postImage', image);
      } else if (imagePreview === null && post.image) {
        // Image removed
        formData.append('removeImage', 'true');
      }
      // If imagePreview is not null and not equal to post.image, it means the image hasn't changed
  
      const response = await fetch(`/api/posts/${post._id}/edit`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        toast.success('Successfully edited the post.');
        onEditComplete();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to edit the post: ${errorData.error}`);
        console.error('Failed to update post:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('An error occurred while updating the post.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <IconButton onClick={() => fileInputRef.current?.click()}>
          <ImageIcon />
        </IconButton>
      </Box>

      {imagePreview && (
        <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
          <Image
            src={imagePreview}
            alt="Preview"
            width={200}
            height={200}
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
          />
          <IconButton
            onClick={handleDeleteImage}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
        <Button onClick={onEditComplete} variant="outlined" sx={{ ml: 1 }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditPostForm;