"use client";
import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useAuth } from '../contexts/AuthContext';

export default function NewPostForm() {
  const [content, setContent] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userId: user?.id }),
      });
      
      if (response.ok) {
        console.log("Post created successfully");
        setContent("");
        // Trigger a re-render of the parent component
        window.dispatchEvent(new CustomEvent('newpost'));
      } else {
        const errorData = await response.json();
        console.error("Failed to create post:", errorData);
      }
    } catch (error) {
      console.error("Error creating post:", error);
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
      <Button
        type="submit"
        variant="contained"
        sx={{ marginTop: 1 }}
      >
        Post
      </Button>
    </Box>
  );
}