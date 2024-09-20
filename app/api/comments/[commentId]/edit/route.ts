import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { uploadFile } from "@/lib/uploadHandler";

export async function PUT(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  await dbConnect();
  const { commentId } = params;

  try {
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const userId = formData.get('userId') as string;
    const removeImage = formData.get('removeImage') === 'true';
    const newImage = formData.get('commentImage') as File | null;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized to edit this comment" }, { status: 403 });
    }

    comment.content = content;

    // Handle image removal or replacement
    if (removeImage) {
      comment.image = null;
    } else if (newImage) {
      // Upload new image to Cloudinary
      const imageUrl = await uploadFile(newImage, 'comment_images');
      comment.image = imageUrl;
    }

    comment.updatedAt = new Date();
    await comment.save();

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error("Failed to update comment:", error);
    return NextResponse.json({ success: false, error: "Failed to update comment" }, { status: 500 });
  }
}