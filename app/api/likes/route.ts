// File: app/api/likes/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Like from "@/models/Like";

export async function POST(request: Request) {
  await dbConnect();
  const { userId, postId } = await request.json();

  try {
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // User has already liked, so remove the like
      await Like.findByIdAndDelete(existingLike._id);
      return NextResponse.json({ 
        success: true, 
        liked: false,
        message: "Like removed successfully"
      });
    } else {
      // User hasn't liked, so add the like
      const newLike = await Like.create({ user: userId, post: postId });
      return NextResponse.json({ 
        success: true, 
        liked: true,
        message: "Like added successfully"
      });
    }
  } catch (error) {
    console.error("Like operation failed:", error);
    return NextResponse.json({ success: false, error: "Like operation failed" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");

  if (!postId) {
    return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
  }

  try {
    const likeCount = await Like.countDocuments({ post: postId });
    let userLiked = false;
    if (userId) {
      userLiked = await Like.exists({ user: userId, post: postId }) !== null;
    }

    return NextResponse.json({ success: true, data: { count: likeCount, userLiked } });
  } catch (error) {
    console.error("Failed to fetch like information:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch like information" }, { status: 500 });
  }
}