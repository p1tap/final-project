import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Post from '@/models/Post';
import Like from '@/models/Like';  // Add this import
import Header from '@/app/components/Header';
import { Box, Typography, Container, Avatar, Paper, Card, CardContent, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Post as PostType } from '@/app/types';

async function getUser(userId: string) {
  if (!userId) {
    console.error("User ID is undefined");
    notFound();
  }
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) {
    console.error("User not found in database");
    notFound();
  }
  return user;
}

async function getUserPosts(userId: string): Promise<PostType[]> {
  await dbConnect();
  const posts = await Post.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('user', 'username name')
    .lean();

  const postsWithLikes = await Promise.all(posts.map(async (post: any) => {
    const likeCount = await Like.countDocuments({ post: post._id });
    return {
      _id: post._id.toString(),
      content: post.content,
      user: {
        _id: post.user._id.toString(),
        username: post.user.username,
        name: post.user.name
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt ? post.updatedAt.toISOString() : undefined,
      likeCount: likeCount
    };
  }));
  return postsWithLikes;
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUser(params.userId);
  const posts = await getUserPosts(params.userId);

  return (
    <Box>
      <Header />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 4, mb: 4, p: 3, textAlign: 'center' }}>
          <Avatar sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}>{user.name[0]}</Avatar>
          <Typography variant="h4">{user.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">@{user.username}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{user.bio || "No bio available"}</Typography>
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