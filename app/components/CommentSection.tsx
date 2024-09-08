"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;  // Add this line
    username: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();


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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to comment.');
      return;
    }
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment,
          userId: user.id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewComment('');
        fetchComments();
        toast.success('Comment posted successfully!');
      } else {
        toast.error(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('An error occurred while posting the comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchComments();
        toast.success('Comment deleted successfully');
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('An error occurred while deleting the comment');
    }
  };

  return (
    <Box>
      <Typography variant="h6">Comments</Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment._id} alignItems="flex-start">
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography component="span" variant="subtitle2">
                    {comment.user.name} (@{comment.user.username})
                  </Typography>
                  {user && user.id === comment.user._id && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="text.primary">
                    {comment.content}
                  </Typography>
                  <br />
                  <Typography component="span" variant="caption" color="text.secondary">
                    Created: {new Date(comment.createdAt).toLocaleString()}
                    {comment.updatedAt !== comment.createdAt && 
                      ` (Edited: ${new Date(comment.updatedAt).toLocaleString()})`}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
      {user ? (
        <Box component="form" onSubmit={handleSubmitComment}>
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
      ) : (
        <Typography variant="body2" color="text.secondary">
          Please log in to post a comment.
        </Typography>
      )}
    </Box>
  );
};

export default CommentSection;