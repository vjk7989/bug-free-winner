import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';

const defaultPermissions = {
  dashboard: false,
  leads: false,
  calendar: false,
  email: false,
  settings: false,
};

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection("users").find({}).toArray();
    
    // Ensure each user has permissions and remove password from response
    const usersWithPermissions = users.map(user => ({
      ...user,
      permissions: user.permissions || defaultPermissions,
      password: undefined // Remove password from response
    }));
    
    return NextResponse.json(usersWithPermissions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const userData = await request.json();

    // Add default permissions if not provided
    if (!userData.permissions) {
      userData.permissions = defaultPermissions;
    }

    // Hash password
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const result = await db.collection("users").insertOne(userData);
    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { id, ...updateData } = await request.json();

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
} 