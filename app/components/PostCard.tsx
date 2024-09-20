"use client";
import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../contexts/AuthContext';
import EditPostForm from './EditPostForm';
import { Post } from '../types';
import { toast } from 'react-toastify';
import CommentSection from './CommentSection';
import Image from 'next/image';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


interface PostCardProps {
  post: Post;
  onPostUpdated: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  // console.log('PostCard user data:', post.user);
  const [liked, setLiked] = useState(post.userLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleClose();
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    handleClose();
    handleDelete();
  };


  const fetchLikeInfo = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/likes?postId=${post._id}&userId=${user.id}`);
      const data = await response.json();
      // console.log(`Fetched like info for post ${post._id}:`, data);
      if (data.success) {
        setLiked(data.data.userLiked);
        setLikeCount(data.data.count);
        // console.log(`Updated like state for post ${post._id}:`, { liked: data.data.userLiked, likeCount: data.data.count });
      }
    } catch (error) {
      console.error('Failed to fetch like info:', error);
    }
  }, [post._id, user?.id]);

  useEffect(() => {
    // console.log(`PostCard mounted for post ${post._id}. Initial state:`, { liked, likeCount });
    fetchLikeInfo();
  }, [fetchLikeInfo]);

  const handleLike = async () => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id, postId: post._id }),
      });
      const data = await response.json();
      // console.log(`Like action response for post ${post._id}:`, data);
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
        // console.log(`Updated like state after action for post ${post._id}:`, { liked: data.liked, likeCount: data.liked ? likeCount + 1 : likeCount - 1 });
      } else {
        console.error('Failed to update like:', data.error);
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${post._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success('Deleted the post')
          onPostUpdated();
        } else {
          toast.error('Failed to delete, try again.')
          console.error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    onPostUpdated();
  };

  if (isEditing) {
    return <EditPostForm post={post} onEditComplete={handleEditComplete} />;
  }

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Link href={`/profile/${post.user._id}`} passHref>
              <Avatar 
                src={post.user.profilePicture} 
                sx={{ mr: 2, cursor: 'pointer' }}
              >
                {!post.user.profilePicture && post.user.name[0]}
              </Avatar>
            </Link>
            <Box>
              <Typography variant="h6">{post.user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                @{post.user.username}
              </Typography>
            </Box>
          </Box>
          {user && user.id === post.user._id && !isEditing && (
            <>
              <IconButton onClick={handleMoreClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Box>
        {isEditing ? (
          <EditPostForm post={post} onEditComplete={handleEditComplete} />
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {post.content}
            </Typography>

            {/* Post image */}
            {post.image && (
            <Box sx={{ mb: 2, position: 'relative', width: '100%', paddingTop: '60%' }}>
              <Image
                src={post.image}
                alt="Post image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={true} // Add this if you can determine if it's the first post
                style={{ objectFit: 'cover' }}
              />
            </Box>
            )}

            {/* Post created and edited timestamps */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center">
                <IconButton onClick={handleLike} color={liked ? "primary" : "default"}>
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2">{likeCount}</Typography>
              </Box>
            </Box>
          </>
        )}
        <CommentSection postId={post._id} />
      </CardContent>
    </Card>
  );
};

export default PostCard;