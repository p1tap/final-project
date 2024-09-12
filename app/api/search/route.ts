import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 });
  }

  try {
    const posts = await Post.find({ content: { $regex: query, $options: 'i' } })
      .populate("user", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(20);

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(20);

    return NextResponse.json({ success: true, data: { posts, users } });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ success: false, error: "An error occurred during search" }, { status: 500 });
  }
}