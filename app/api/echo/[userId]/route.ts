import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId?: string, userid?: string } }
) {
  console.log('Echo API received params:', params);
  const userId = params.userId || params.userid;
  console.log('Echo API using userId:', userId);
  return NextResponse.json({ userId });
}