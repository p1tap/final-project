import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import Like from "@/models/Like";
import { uploadFile } from "@/lib/uploadHandler";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  //console.log(`GET /api/posts - Query params:`, { userId });

  try {
    let query = {};
    if (userId) {
      query = { user: userId };
    }

    const posts = await Post.find(query)
      .populate("user", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);
    
    const postsWithLikes = await Promise.all(posts.map(async (post) => {
      const likeCount = await Like.countDocuments({ post: post._id });
      const userLiked = userId ? await Like.exists({ post: post._id, user: userId }) !== null : false;
      //console.log(`Post ${post._id} like info:`, { likeCount, userLiked });
      return {
        ...post.toObject(),
        likeCount,
        userLiked,
      };
    }));

    //console.log(`GET /api/posts - Returning ${postsWithLikes.length} posts`);
    return NextResponse.json({ success: true, data: postsWithLikes });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { fields, file } = await uploadFile(request);

    console.log("Received fields:", fields); // Add this line for debugging

    if (!fields.content || !fields.content[0] || !fields.userId || !fields.userId[0]) {
      return NextResponse.json({ success: false, error: "Missing required fields", receivedFields: fields }, { status: 400 });
    }

    const newPost = await Post.create({
      content: fields.content[0],
      user: fields.userId[0],
      image: file.postImage?.[0]?.filepath
    });

    const populatedPost = await Post.findById(newPost._id).populate("user", "username name profilePicture");

    return NextResponse.json({ success: true, data: populatedPost }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ success: false, error: "An error occurred while creating the post" }, { status: 500 });
  }
}