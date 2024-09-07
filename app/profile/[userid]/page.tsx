// app/profile/[userId]/page.tsx
import { notFound } from 'next/navigation';
import { Box, Typography, Container, Avatar } from '@mui/material';
import Header from '../../components/Header';
import PostCard from '../../components/PostCard';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Post from '@/models/Post';

async function getUser(userId: string) {
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) {
    notFound();
  }
  return user;
}

async function getUserPosts(userId: string) {
  await dbConnect();
  const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).populate('user', 'username name');
  return posts;
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUser(params.userId);
  const posts = await getUserPosts(params.userId);

  return (
    <Box>
      <Header />
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Avatar sx={{ width: 100, height: 100, margin: '0 auto' }}>{user.name[0]}</Avatar>
          <Typography variant="h4" sx={{ mt: 2 }}>{user.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">@{user.username}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{user.bio}</Typography>
        </Box>
        <Typography variant="h5" sx={{ mb: 2 }}>Posts</Typography>
        {posts.map((post) => (
          <PostCard key={post._id.toString()} post={post} />
        ))}
      </Container>
    </Box>
  );
}