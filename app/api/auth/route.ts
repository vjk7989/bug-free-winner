import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { cookies } from 'next/headers'

// For demo purposes, we'll use a simple credential check
// In production, you should use a proper database and password hashing
const VALID_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "admin123",
  name: "Admin User",
  role: "Administrator",
  id: "1",
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db.collection("users").findOne({ email })
    console.log("Found user:", user) // Debug log

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log("Password valid:", isValidPassword) // Debug log

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Set cookie
    const cookieStore = cookies()
    cookieStore.set('user', JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Login successful"
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}

