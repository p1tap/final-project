// app/components/PostCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import CommentSection from './CommentSection';

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
  const [commentOpen, setCommentOpen] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post._id, userId: 'placeholder-user-id' }), // Replace with actual user ID when auth is implemented
      });
      if (response.ok) {
        setLiked(!liked);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{post.user.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          @{post.user.username}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          {post.content}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(post.createdAt).toLocaleString()}
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Button
            startIcon={<ThumbUpIcon />}
            onClick={handleLike}
            color={liked ? 'primary' : 'inherit'}
          >
            Like
          </Button>
          <Button
            startIcon={<CommentIcon />}
            onClick={() => setCommentOpen(!commentOpen)}
          >
            Comment
          </Button>
        </Box>
        {commentOpen && <CommentSection postId={post._id} />}
      </CardContent>
    </Card>
  );
};

export default PostCard;