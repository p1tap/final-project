import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, password, name } = await request.json();

  try {
    const user = await User.create({ username, password, name });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: "User creation failed" }, { status: 400 });
  }
}