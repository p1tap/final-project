// app/api/posts/[postId]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await dbConnect();
  const { postId } = params;

  try {
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}