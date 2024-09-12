"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import Header from '@/app/components/Header';
import PostCard from '@/app/components/PostCard';
import Link from 'next/link';
import { Post, User } from '@/app/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query || '')}`);
        const data = await response.json();
        if (data.success) {
          setPosts(data.data.posts);
          setUsers(data.data.users);
        } else {
          console.error('Search failed:', data.error);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) {
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
          Search Results for "{query}"
        </Typography>
        
        <Typography variant="h5" gutterBottom>Users</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user._id} component={Link} href={`/profile/${user._id}`}>
              <ListItemAvatar>
                <Avatar src={user.profilePicture}>
                  {!user.profilePicture && user.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={`@${user.username}`} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" gutterBottom>Posts</Typography>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onPostUpdated={() => {}} />
        ))}
      </Box>
    </Box>
  );
}