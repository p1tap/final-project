import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { uploadFile } from "@/lib/uploadHandler";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  await dbConnect();
  const { postId } = params;

  try {
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const removeImage = formData.get('removeImage') === 'true';
    const newImage = formData.get('postImage') as File | null;

    const updateData: any = { content };

    // Fetch the current post
    const currentPost = await Post.findById(postId);
    if (!currentPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // Handle image removal or replacement
    if (removeImage) {
      updateData.image = null;
    } else if (newImage) {
      // Upload new image to Cloudinary
      const imageUrl = await uploadFile(newImage, 'post_images');
      updateData.image = imageUrl;
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
  }
}