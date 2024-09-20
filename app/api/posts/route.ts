import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import Like from "@/models/Like";
import { uploadFile } from "@/lib/uploadHandler";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  // console.log(`GET /api/posts - Query params:`, { userId });

  try {
    const query = {};
    // Remove this condition to fetch all posts regardless of user
    // if (userId) {
    //   query = { user: userId };
    // }

    // console.log("Query for posts:", query);

    const posts = await Post.find(query)
      .populate("user", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);

    // console.log(`Found ${posts.length} posts before adding like information`);
    
    const postsWithLikes = await Promise.all(posts.map(async (post) => {
      const likeCount = await Like.countDocuments({ post: post._id });
      const userLiked = userId ? await Like.exists({ post: post._id, user: userId }) !== null : false;
      // console.log(`Post ${post._id} info:`, { 
      //   userId: post.user._id, 
      //   username: post.user.username, 
      //   content: post.content.substring(0, 20) + "...", 
      //   likeCount, 
      //   userLiked 
      // });
      return {
        ...post.toObject(),
        likeCount,
        userLiked,
      };
    }));

    // console.log(`GET /api/posts - Returning ${postsWithLikes.length} posts`);
    return NextResponse.json({ success: true, data: postsWithLikes });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ success: false, error: "An unknown error occurred" }, { status: 500 });
  }
}


// export async function HEAD(request: Request) {
//   await dbConnect();
//   try {
//     const users = await User.find({}).select('_id username');
//     // console.log("All users:");
//     for (const user of users) {
//       const postCount = await Post.countDocuments({ user: user._id });
//       // console.log(`User ${user.username} (${user._id}): ${postCount} posts`);
//     }
//     return new Response(null, { status: 200 });
//   } catch (error) {
//     console.error("Failed to fetch user and post information:", error);
//     return new Response(null, { status: 500 });
//   }
// }

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();

    const content = formData.get('content') as string | null;
    const userId = formData.get('userId') as string;
    const postImage = formData.get('postImage') as File | null;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    if (!content && !postImage) {
      return NextResponse.json({ success: false, error: "Either content or image is required" }, { status: 400 });
    }

    let imageUrl = null;
    if (postImage) {
      imageUrl = await uploadFile(postImage, 'post_images');
    }

    const newPost = await Post.create({
      content: content || "",
      user: userId,
      image: imageUrl
    });

    const populatedPost = await Post.findById(newPost._id).populate("user", "username name profilePicture");

    return NextResponse.json({ success: true, data: populatedPost }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ success: false, error: "An error occurred while creating the post" }, { status: 500 });
  }
}