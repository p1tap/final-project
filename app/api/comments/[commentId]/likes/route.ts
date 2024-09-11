import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CommentLike from "@/models/CommentLike";

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  await dbConnect();
  const { commentId } = params;
  const { userId } = await request.json();

  try {
    const existingLike = await CommentLike.findOne({ user: userId, comment: commentId });

    if (existingLike) {
      await CommentLike.findByIdAndDelete(existingLike._id);
      return NextResponse.json({ 
        success: true, 
        liked: false,
        message: "Like removed successfully"
      });
    } else {
      await CommentLike.create({ user: userId, comment: commentId });
      return NextResponse.json({ 
        success: true, 
        liked: true,
        message: "Like added successfully"
      });
    }
  } catch (error) {
    console.error("Comment like operation failed:", error);
    return NextResponse.json({ success: false, error: "Like operation failed" }, { status: 400 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  await dbConnect();
  const { commentId } = params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const likeCount = await CommentLike.countDocuments({ comment: commentId });
    let userLiked = false;
    if (userId) {
      userLiked = await CommentLike.exists({ user: userId, comment: commentId }) !== null;
    }

    return NextResponse.json({ success: true, data: { count: likeCount, userLiked } });
  } catch (error) {
    console.error("Failed to fetch comment like information:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch like information" }, { status: 500 });
  }
}