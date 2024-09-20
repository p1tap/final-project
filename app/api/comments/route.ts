// app/api/comments/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { uploadFile } from "@/lib/uploadHandler"; 

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
      .select('content image createdAt updatedAt user')
      .sort({ createdAt: -1 })
      .lean();  

    // console.log('Raw Fetched comments:', JSON.stringify(comments, null, 2));

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, error: "Failed to fetch comments" }, { status: 500 });
  }
}

// ... existing imports ...

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const postId = formData.get('postId') as string;
    const content = formData.get('content') as string | null;
    const commentImage = formData.get('commentImage') as File | null;


    if (!content && !commentImage) {
      return NextResponse.json({ success: false, error: "Comment must have either text content or an image" }, { status: 400 });
    }

    let imageUrl = null;
    if (commentImage) {
      try {
        imageUrl = await uploadFile(commentImage, 'comment_images');
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 });
      }
    }

    const commentData = { 
      user: userId, 
      post: postId, 
      content: content || "",  // Use an empty string if no content is provided
      image: imageUrl
    };

    const comment = await Comment.create(commentData);

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "username name profilePicture")
      .lean();
    
    return NextResponse.json({ success: true, data: populatedComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, error: "Comment creation failed" }, { status: 400 });
  }
}