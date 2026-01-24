import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, ageConfirmed } = await request.json()

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        if (!ageConfirmed) {
            return NextResponse.json(
                { error: 'You must confirm you are 18+ years old' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user and credentials account
        const user = await prisma.user.create({
            data: {
                name,
                email,
                ageConfirmed: true,
                accounts: {
                    create: {
                        type: 'credentials',
                        provider: 'credentials',
                        providerAccountId: email,
                        access_token: hashedPassword, // Store hashed password
                    },
                },
            },
        })

        return NextResponse.json({
            message: 'Account created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}
