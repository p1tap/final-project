import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET() {
  await dbConnect();

  try {
    const posts = await Post.find().populate("user", "username name").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const { userId, content } = await request.json();

  try {
    const post = await Post.create({ user: userId, content });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Post creation failed" }, { status: 400 });
  }
}