import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim()

        // Check if user exists (but don't reveal this in the response for security)
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a password reset link.',
            })
        }

        // Check for recent reset requests (rate limiting)
        const recentToken = await prisma.passwordResetToken.findFirst({
            where: {
                email: normalizedEmail,
                createdAt: {
                    gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        if (recentToken) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a password reset link.',
            })
        }

        // Generate secure random token
        const token = crypto.randomBytes(32).toString('hex')

        // Create reset token (expires in 1 hour)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        await prisma.passwordResetToken.create({
            data: {
                email: normalizedEmail,
                token,
                expiresAt,
            },
        })

        // Send email
        await sendPasswordResetEmail({
            email: normalizedEmail,
            resetToken: token,
            userName: user.name || undefined,
        })

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive a password reset link.',
        })
    } catch (error) {
        console.error('Error in forgot password:', error)
        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        )
    }
}
