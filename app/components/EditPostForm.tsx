"use client";
import React, { useState, useRef } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import { Post } from '../types';
import { toast } from 'react-toastify';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditPostFormProps {
  post: Post;
  onEditComplete: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post, onEditComplete }) => {
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(post.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('postImage', image);
      } else if (imagePreview === null) {
        formData.append('removeImage', 'true');
      }

      const response = await fetch(`/api/posts/${post._id}/edit`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        toast.success('Successfully edited the post.')
        onEditComplete();
      } else {
        toast.error('Failed to edit the post.')
        console.error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(undefined);
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
        {imagePreview && (
          <IconButton onClick={handleRemoveImage}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      {imagePreview && (
        <Box sx={{ mt: 2 }}>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
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