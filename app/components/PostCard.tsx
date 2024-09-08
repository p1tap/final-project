import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../contexts/AuthContext';

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

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchLikeInfo();
  }, [post._id, user?.id]);

  const fetchLikeInfo = async () => {
    try {
      const response = await fetch(`/api/likes?postId=${post._id}&userId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setLiked(data.data.userLiked);
        setLikeCount(data.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch like info:', error);
    }
  };

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
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ mr: 2 }}>{post.user.name[0]}</Avatar>
          <Box>
            <Typography variant="h6">{post.user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              @{post.user.username}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.content}
        </Typography>
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
      </CardContent>
    </Card>
  );
};

export default PostCard;