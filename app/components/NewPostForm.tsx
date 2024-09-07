// app/components/NewPostForm.tsx
"use client";
import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function NewPostForm() {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userId: "placeholder-user-id" }), // Replace with actual user ID when auth is implemented
      });
      if (response.ok) {
        setContent("");
        router.refresh(); // Refresh the page to show the new post
      }
    } catch (error) {
      console.error("Failed to create post:", error);
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