import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Like from "@/models/Like";

export async function POST(request: Request) {
  await dbConnect();
  const { userId, postId } = await request.json();

  try {
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return NextResponse.json({ success: true, message: "Like removed" });
    } else {
      const like = await Like.create({ user: userId, post: postId });
      return NextResponse.json({ success: true, data: like });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Like operation failed" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
  }

  try {
    const likeCount = await Like.countDocuments({ post: postId });
    return NextResponse.json({ success: true, data: { count: likeCount } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch like count" }, { status: 500 });
  }
}