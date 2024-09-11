"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import CommentSection from '@/app/components/CommentSection';
import EditProfileForm from '@/app/components/EditProfileForm';
import { Box, Typography, Container, Avatar, Paper, Card, CardContent, IconButton, CircularProgress, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Post as PostType } from '@/app/types';
import { useAuth } from '@/app/contexts/AuthContext';


export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const { user: currentUser } = useAuth();

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/profile/${params.userId}`);
      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        setPosts(data.data.posts);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [params.userId]);

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    fetchProfileData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  const isOwnProfile = currentUser && currentUser.id === user._id;
  return (
    <Box>
      <Header />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 4, mb: 4, p: 3, textAlign: 'center' }}>
          <Avatar 
            src={user.profilePicture || undefined} 
            sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
          >
            {!user.profilePicture && user.name[0]}
          </Avatar>
          {isEditing ? (
            <EditProfileForm user={user} onUpdateSuccess={handleUpdateSuccess} />
          ) : (
            <>
              <Typography variant="h4">{user.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">@{user.username}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>{user.bio || "No bio available"}</Typography>
              {isOwnProfile && (
                <Button onClick={() => setIsEditing(true)} variant="outlined" sx={{ mt: 2 }}>
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </Paper>
        <Typography variant="h5" sx={{ mb: 2 }}>Posts</Typography>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">{post.content}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <IconButton size="small" disabled>
                    <FavoriteIcon color="action" />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {post.likeCount} likes
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Posted on: {new Date(post.createdAt).toLocaleString()}
                </Typography>
                <CommentSection postId={post._id} />
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">No posts yet.</Typography>
        )}
      </Container>
    </Box>
  );
}