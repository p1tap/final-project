import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

interface Comment {
  _id: string;
  content: string;
  user: {
    username: string;
    name: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment,
          userId: 'placeholder-user-id', // TODO: Replace with actual user ID when auth is implemented
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Comments</Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment._id}>
            <ListItemText
              primary={comment.user.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {comment.content}
                  </Typography>
                  {" — "}{new Date(comment.createdAt).toLocaleString()}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmitComment(); }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Post Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;