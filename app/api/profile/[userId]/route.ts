import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Post from '@/models/Post';
import Like from '@/models/Like';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

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

    return NextResponse.json({ success: true, data: { user, posts: postsWithLikes } });
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return NextResponse.json({ success: false, error: "Failed to fetch profile data" }, { status: 500 });
  }
}