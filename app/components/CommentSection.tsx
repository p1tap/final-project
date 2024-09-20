"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Avatar } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';
import ImageIcon from '@mui/icons-material/Image';
import Image from 'next/image';

interface Comment {
  _id: string;
  content: string;
  image?: string;
  user: {
    _id: string; 
    username: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number, userLiked: boolean }>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingCommentId, setProcessingCommentId] = useState<string | null>(null);



  // Wrap fetchComments in useCallback
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      if (data.success) {
        // console.log('Fetched comments:', data.data);
        setComments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, [postId]);

  // Wrap fetchCommentLikes in useCallback
  const fetchCommentLikes = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/likes?userId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: { count: data.data.count, userLiked: data.data.userLiked }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch comment likes:', error);
    }
  }, [user?.id]); // Add user?.id as a dependency

  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]); // Add fetchComments to the dependency array

  useEffect(() => {
    // Fetch initial like status and count for each comment
    comments.forEach(comment => fetchCommentLikes(comment._id));
  }, [comments, fetchCommentLikes]); // Add fetchCommentLikes to the dependency array

const handleSubmitComment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) {
    toast.error('You must be logged in to comment.');
    return;
  }
  setIsPosting(true);
  try {
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('content', newComment);
    formData.append('userId', user.id);
    if (commentImage) {
      formData.append('commentImage', commentImage);
      // console.log('Appending image to form data:', commentImage);
    }

    // console.log('Submitting comment:', { postId, content: newComment, userId: user.id, hasImage: !!commentImage });

    const response = await fetch('/api/comments', {
      method: 'POST',
      body: formData,
    });
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      toast.error('Server response was not valid JSON');
      return;
    }

    // console.log('Parsed response data:', data);

    if (data.success) {
      setNewComment('');
      setCommentImage(null);
      fetchComments();
      toast.success('Comment posted successfully!');
    } else {
      toast.error(data.error || 'Failed to post comment');
    }
  } catch (error) {
    console.error('Failed to submit comment:', error);
    toast.error('An error occurred while posting the comment');
  } finally {
    setIsPosting(false);
  }
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCommentImage(e.target.files[0]);
    }
  };


  const handleDeleteComment = async (commentId: string) => {
    setProcessingCommentId(commentId);
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
    } finally {
      setProcessingCommentId(null);
    }
  };

  const handleEditComment = async (commentId: string) => {
    setProcessingCommentId(commentId);
    setEditingComment(commentId);
    const comment = comments.find(c => c._id === commentId);
    if (comment) {
      setEditContent(comment.content);
    }
    setProcessingCommentId(null);
  };

  const handleSaveEdit = async (commentId: string) => {
    setProcessingCommentId(commentId);
    try {
      const response = await fetch(`/api/comments/${commentId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          userId: user?.id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setComments(comments.map(comment => 
          comment._id === commentId ? { ...comment, content: editContent, updatedAt: new Date().toISOString() } : comment
        ));
        setEditingComment(null);
        toast.success('Comment updated successfully');
      } else {
        toast.error(data.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('An error occurred while updating the comment');
    } finally {
      setProcessingCommentId(null);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchCommentLikes(commentId);
      }
    } catch (error) {
      console.error('Failed to like/unlike comment:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Comments</Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment._id} alignItems="flex-start">
            <Link href={`/profile/${comment.user._id}`} passHref>
              <Avatar 
                src={comment.user.profilePicture} 
                sx={{ mr: 2, cursor: 'pointer' }}
              >
                {!comment.user.profilePicture && comment.user.name[0]}
              </Avatar>
            </Link>

            {/* Menu for editing and deleting comments */}
            <ListItemText
              primary={
                <Box component="div">
                  <Typography component="span" variant="subtitle2">
                    {comment.user.name} (@{comment.user.username})
                  </Typography>
                  {user && user.id === comment.user._id && (
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditComment(comment._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              }
              secondary={
                <Box component="div">
                  {editingComment === comment._id ? (
                    // Editing interface
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        margin="normal"
                      />
                      <Button onClick={() => handleSaveEdit(comment._id)}>Save</Button>
                      <Button onClick={() => setEditingComment(null)}>Cancel</Button>
                    </Box>
                  ) : (
                    // Normal comment display
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {comment.content}
                      </Typography>
                      <br />

                      {/* Comment image */}
                      {comment.image && (
                        <Box sx={{ mt: 1, mb: 1, maxWidth: '300px' }}>
                          <Image
                            src={comment.image}
                            alt="Comment image"
                            width={400}
                            height={400}
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </Box>
                      )}
                      <br />

                      {/* Created and edited timestamps */}
                      <Typography component="span" variant="caption" color="text.secondary">
                        Created: {new Date(comment.createdAt).toLocaleString()}
                        {comment.updatedAt !== comment.createdAt && 
                          ` (Edited: ${new Date(comment.updatedAt).toLocaleString()})`}
                      </Typography>

                      {/* Like button and count */}
                      <IconButton onClick={() => handleCommentLike(comment._id)} size="small">
                        {commentLikes[comment._id]?.userLiked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <Typography variant="caption" component="span">
                        {commentLikes[comment._id]?.count || 0} likes
                      </Typography>
                    </>
                  )}
                </Box>
              }
              primaryTypographyProps={{ component: 'div' }}
              secondaryTypographyProps={{ component: 'div' }}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <IconButton onClick={() => fileInputRef.current?.click()}>
              <ImageIcon />
            </IconButton>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={isPosting}
              startIcon={isPosting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isPosting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
          {commentImage && (
          <Box sx={{ mt: 2 }}>
            <Image
              src={URL.createObjectURL(commentImage)}
              alt="Selected"
              width={100}
              height={100}
              style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }}
            />
          </Box>
        )}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Please log in to post a comment.
        </Typography>
      )}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!processingCommentId}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default CommentSection;