"use client";
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Post } from '../types';
import { toast } from 'react-toastify';


interface EditPostFormProps {
  post: Post;
  onEditComplete: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post, onEditComplete }) => {
  const [content, setContent] = useState(post.content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${post._id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
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
      <Button type="submit" variant="contained" color="primary">
        Save Changes
      </Button>
      <Button onClick={onEditComplete} variant="outlined">
        Cancel
      </Button>
    </Box>
  );
};

export default EditPostForm;