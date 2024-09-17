// File: app/api/likes/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Like from "@/models/Like";

export async function POST(request: Request) {
  await dbConnect();
  const { userId, postId } = await request.json();

  //console.log(`POST /api/likes - Request body:`, { userId, postId });

  try {
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      //console.log(`POST /api/likes - Like removed:`, { userId, postId });
      return NextResponse.json({ 
        success: true, 
        liked: false,
        message: "Like removed successfully"
      });
    } else {
      await Like.create({ user: userId, post: postId });
      //console.log(`POST /api/likes - Like added:`, { userId, postId });
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

  //console.log(`GET /api/likes - Query params:`, { postId, userId });

  if (!postId) {
    return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
  }

  try {
    const likeCount = await Like.countDocuments({ post: postId });
    let userLiked = false;
    if (userId) {
      userLiked = await Like.exists({ user: userId, post: postId }) !== null;
    }

    //console.log(`GET /api/likes - Response:`, { postId, userId, likeCount, userLiked });
    return NextResponse.json({ success: true, data: { count: likeCount, userLiked } });
  } catch (error) {
    console.error("Failed to fetch like information:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch like information" }, { status: 500 });
  }
}