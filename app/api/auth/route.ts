import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

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

    // Log the received credentials for debugging
    console.log("Login attempt:", { email, password })

    // Simple credential check
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      const token = sign({ userId: VALID_CREDENTIALS.id }, process.env.JWT_SECRET || "default-secret-key", {
        expiresIn: "1h",
      })

      const { password: _, ...userWithoutPassword } = VALID_CREDENTIALS

      return NextResponse.json({
        success: true,
        token,
        user: userWithoutPassword,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid email or password",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
      },
      { status: 500 },
    )
  }
}

