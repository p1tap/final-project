// app/api/comments/[commentId]/edit/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";

export async function PUT(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  await dbConnect();
  const { commentId } = params;
  const { content, userId } = await request.json();

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized to edit this comment" }, { status: 403 });
    }

    comment.content = content;
    comment.updatedAt = new Date();
    await comment.save();

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error("Failed to update comment:", error);
    return NextResponse.json({ success: false, error: "Failed to update comment" }, { status: 500 });
  }
}