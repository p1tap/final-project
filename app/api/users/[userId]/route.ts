import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 });
  }
}