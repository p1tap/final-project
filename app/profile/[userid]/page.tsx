"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Container, Avatar, Button, CircularProgress, Backdrop } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '@/app/contexts/AuthContext';
import PostCard from '@/app/components/PostCard';
import EditProfileForm from '@/app/components/EditProfileForm';
import { Post, User } from '@/app/types';
import Header from '@/app/components/Header';
import NewPostForm from "@/app/components/NewPostForm";
import SortButton from '@/app/components/SortButton';



interface EditProfileFormProps {
  user: {
    _id: string;
    name: string;
    bio?: string; // Make bio optional
    profilePicture?: string;
    username: string;
  };
  onUpdateSuccess: () => void;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId || params?.userid || null;
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(false);




  const fetchProfileData = useCallback(async () => {
    if (userId) {
      try {
        // console.log('Fetching profile data for userId:', userId);
        const response = await fetch(`/api/profile/${userId}`);
        const data = await response.json();
        // console.log('Profile data received:', data);
        if (data.success) {
          setProfileUser(data.data.user);
          setPosts(data.data.posts);
          // console.log('Posts set in state:', data.data.posts);
        } else {
          console.error('Failed to fetch profile data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [userId, refetchTrigger]);

  const handlePostCreated = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  const handleEditProfile = () => {
    setIsLoading(true);
    // Simulate a delay (remove this in production and replace with actual loading logic)
    setTimeout(() => {
      setIsEditing(true);
      setIsLoading(false);
    }, 1000);
  };


  const handleUpdateSuccess = () => {
    setIsEditing(false);
    // Refetch user data to update the profile
    if (userId) {
      fetch(`/api/profile/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setProfileUser(data.data.user);
          }
        })
        .catch(error => console.error('Error refetching profile data:', error));
    }
  };

  const handlePostUpdated = () => {
    // Refetch posts when a post is updated
    if (userId) {
      fetch(`/api/profile/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setPosts(data.data.posts);
          }
        })
        .catch(error => console.error('Error refetching posts:', error));
    }
    setRefetchTrigger(prev => prev + 1);
  };

  const handleSortChange = (newSortOrder: 'newest' | 'oldest') => {
    setSortOrder(newSortOrder);
    const sortedPosts = [...posts].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return newSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setPosts(sortedPosts);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!profileUser) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4">User not found</Typography>
      </Container>
    );
  }

  return (
    <>
    <Header />
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profileUser.profilePicture}
              sx={{ width: 100, height: 100, mr: 3 }}
            >
              {!profileUser.profilePicture && profileUser.name[0]}
            </Avatar>
            {currentUser && currentUser.id === profileUser._id && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={handleEditProfile}
              >
                <EditIcon sx={{ color: 'white', fontSize: 16 }} />
              </Box>
            )}
          </Box>

          {/* Profile Info */}
          <Box>
            <Typography variant="h4">{profileUser.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">@{profileUser.username}</Typography>
            {currentUser && currentUser.id === profileUser._id && !isEditing && (
              
              // Edit Profile 
              <Button variant="outlined" onClick={handleEditProfile} sx={{ mt: 1 }}>
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
        
        {!isEditing && (
          <Typography variant="body1" sx={{ mb: 4 }}>
            {profileUser.bio || "No bio available"}
          </Typography>
        )}

        {isEditing ? (
          <EditProfileForm 
          user={{
            ...profileUser,
            bio: profileUser.bio || '' // Provide empty string as default
          }} 
          onUpdateSuccess={handleUpdateSuccess} 
        />
        ) : (
          <Box>
            {currentUser && currentUser.id === profileUser._id && (
              <NewPostForm onPostCreated={handlePostCreated} />
            )}
            <Typography variant="h5" sx={{ mb: 2 }}>Posts</Typography>
            <SortButton sortOrder={sortOrder} onSortChange={handleSortChange} />
            {posts.map(post => {
                // console.log('Rendering post:', post);
                return (
                  <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
                );
              })}
            </Box>
        )}
      </Box>
    </Container>
    </>
  );
}