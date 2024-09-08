import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET() {
  try {
    await dbConnect();

    const posts = await Post.find()
      .populate("user", "username name")
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log("Fetched posts:", posts);
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    console.log("Received data in POST /api/posts:", body);

    const { userId, content } = body;

    if (!userId) {
      console.log("Missing userId");
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    if (!content) {
      console.log("Missing content");
      return NextResponse.json({ success: false, error: "Missing content" }, { status: 400 });
    }

    const post = await Post.create({ user: userId, content });
    console.log("Created post:", post);
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Post creation error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: "Post creation failed", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Post creation failed" }, { status: 400 });
  }
}