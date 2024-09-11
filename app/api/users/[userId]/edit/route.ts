import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;
  const { name, bio } = await request.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}