// app/api/comments/[commentId]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  await dbConnect();
  const { commentId } = params;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete comment" }, { status: 500 });
  }
}