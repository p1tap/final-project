// app/page.tsx
"use client";
import { Box, Typography, CircularProgress } from "@mui/material";
import Header from "./components/Header";
import PostCard from "./components/PostCard";
import NewPostForm from "./components/NewPostForm";
import { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";

// Define the Post type
interface Post {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    name: string;
  };
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoading: authLoading, user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchPosts();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <Box>
      <Header />
      <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Social Media Feed
        </Typography>
        <NewPostForm />
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </Box>
    </Box>
  );
}
