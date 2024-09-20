import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, password, name } = await request.json();

    // Basic validation
    if (!username || !password || !name) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Username already exists' }, { status: 400 });
    }

    // Create new user
    const newUser = await User.create({ username, password, name });

    return NextResponse.json({ success: true, message: 'User registered successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred during registration' }, { status: 500 });
  }
}