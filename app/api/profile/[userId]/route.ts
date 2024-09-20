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
  image?: string;
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
  console.log('Profile API called with params:', params);
  await dbConnect();
  const { userId } = params;

  if (!userId) {
    console.error('User ID is undefined');
    return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
  }

  try {
    console.log('Attempting to find user with ID:', userId);
    const user = await User.findById(userId).select('-password').lean() as Omit<IUser, 'password'>;
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    console.log('User found:', user);

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username name profilePicture')
      .lean() as (IPost & { user: { _id: Types.ObjectId; username: string; name: string } })[];

    const postsWithLikes: PostWithLikes[] = await Promise.all(posts.map(async (post) => {
      const likeCount = await Like.countDocuments({ post: post._id });
      return {
        _id: post._id.toString(),
        content: post.content,
        image: post.image,
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