"use client";
import { Box, Typography, CircularProgress } from "@mui/material";
import Header from "./components/Header";
import PostCard from "./components/PostCard";
import NewPostForm from "./components/NewPostForm";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Post } from "./types";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    try {
      //("Fetching posts...");
      const response = await fetch(`/api/posts?userId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        //console.log("Fetched posts:", data.data);
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handlePostUpdated = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch posts if user is logged in
  useEffect(() => {
    if (!authLoading && user) {
      fetchPosts();
    }
  }, [authLoading, user, fetchPosts]);

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const handleNewPost = () => {
      fetchPosts();
    };

    window.addEventListener('newpost', handleNewPost);

    return () => {
      window.removeEventListener('newpost', handleNewPost);
    };
  }, [fetchPosts]);

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
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
          <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
        ))}
      </Box>
    </Box>
  );
}