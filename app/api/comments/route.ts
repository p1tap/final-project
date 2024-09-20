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

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const postId = formData.get('postId') as string;
    const content = formData.get('content') as string;
    const commentImage = formData.get('commentImage') as File | null;

    // console.log('Received form data:', { userId, postId, content, hasImage: !!commentImage });

    let imageUrl = null;
    if (commentImage) {
      // console.log('Uploading image:', commentImage.name);
      try {
        imageUrl = await uploadFile(commentImage, 'comment_images');
        // console.log('Uploaded image URL:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
      }
    } else {
      // console.log('No image to upload');
    }

    const commentData = { 
      user: userId, 
      post: postId, 
      content,
      image: imageUrl
    };

    // console.log('Creating comment with data:', commentData);

    const comment = await Comment.create(commentData);

    // console.log('Created comment:', JSON.stringify(comment.toObject(), null, 2));

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "username name profilePicture")
      .lean();
    
    // console.log('Populated comment:', JSON.stringify(populatedComment, null, 2));

    return NextResponse.json({ success: true, data: populatedComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, error: "Comment creation failed" }, { status: 400 });
  }
}