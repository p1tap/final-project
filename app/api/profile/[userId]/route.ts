//app\api\profile\[userId]\route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Post from '@/models/Post';
import Like from '@/models/Like';
import { IPost } from '@/models/Post';
import { IUser } from '@/models/User';
import { Types } from 'mongoose';

interface PostWithLikes {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await User.findById(userId).select('-password').lean() as Omit<IUser, 'password'>;
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username name profilePicture')
      .lean() as (IPost & { user: { _id: Types.ObjectId; username: string; name: string } })[];

    const postsWithLikes: PostWithLikes[] = await Promise.all(posts.map(async (post) => {
      const likeCount = await Like.countDocuments({ post: post._id });
      return {
        _id: post._id.toString(),
        content: post.content,
        user: {
          _id: post.user._id.toString(),
          username: post.user.username,
          name: post.user.name,
          profilePicture: post.user.profilePicture
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