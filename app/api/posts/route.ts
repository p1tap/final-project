import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import Like from "@/models/Like";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    let query = {};
    if (userId) {
      query = { user: userId };
    }

    const posts = await Post.find(query)
      .populate("user", "username name")
      .sort({ createdAt: -1 })
      .limit(50);
    
    const postsWithLikes = await Promise.all(posts.map(async (post) => {
      const likeCount = await Like.countDocuments({ post: post._id });
      return {
        ...post.toObject(),
        likeCount,
      };
    }));

    return NextResponse.json({ success: true, data: postsWithLikes });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}