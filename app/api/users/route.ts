import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Generate a unique ID for the new user
    const newUser = {
      id: uuidv4(),
      ...userData,
      permissions: [] // Initialize empty permissions
    };

    // In a real app, you would save this to a database
    // For now, we'll store in localStorage on the client side
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 