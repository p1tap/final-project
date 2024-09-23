import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { uploadFile } from "@/lib/uploadHandler";

interface UpdateData {
  name?: string;
  bio?: string;
  profilePicture?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;

  try {
    const formData = await request.formData();
    const updateData: UpdateData = {};
    
    if (formData.get('name')) updateData.name = formData.get('name') as string;
    if (formData.get('bio')) updateData.bio = formData.get('bio') as string;

    const profilePicture = formData.get('profilePicture') as File | null;
    if (profilePicture) {
      const imageUrl = await uploadFile(profilePicture, 'user_avatars');
      updateData.profilePicture = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
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