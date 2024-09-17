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
    const { fields, file } = await uploadFile(request);

    const updateData: UpdateData = {};
    
    if (fields.name && fields.name[0]) updateData.name = fields.name[0];
    if (fields.bio && fields.bio[0]) updateData.bio = fields.bio[0];

    if (file && file.profilePicture) {
      updateData.profilePicture = file.profilePicture[0].filepath;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    //console.log("Updated user data:", updatedUser);


    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}