// app/api/posts/[postId]/edit/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await dbConnect();
  const { postId } = params;
  const { content } = await request.json();

  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
  }
}