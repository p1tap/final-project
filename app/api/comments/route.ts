// app/api/comments/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
  }

  try {
    const comments = await Comment.find({ post: postId })
      .populate("user", "username name profilePicture") 
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const { userId, postId, content } = await request.json();

  try {
    const comment = await Comment.create({ user: userId, post: postId, content });
    const populatedComment = await comment.populate("user", "username name profilePicture"); // Add profilePicture here
    return NextResponse.json({ success: true, data: populatedComment });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Comment creation failed" }, { status: 400 });
  }
}