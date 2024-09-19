import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, password } = await request.json();
    console.log('Login attempt:', { username });

    // Basic validation
    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Find user by username
    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Login successful
    // For now, we'll just return a success message
    // In a real app, you'd set up a session or return a JWT here
    console.log('Login successful for user:', user.username);
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: { 
        id: user._id, 
        username: user.username, 
        name: user.name,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred during login' }, { status: 500 });
  }
}