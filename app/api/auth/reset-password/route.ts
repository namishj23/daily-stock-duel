import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            )
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            )
        }

        // Find and validate token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        })

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset link' },
                { status: 400 }
            )
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json(
                { error: 'This reset link has expired. Please request a new one.' },
                { status: 400 }
            )
        }

        // Check if token was already used
        if (resetToken.used) {
            return NextResponse.json(
                { error: 'This reset link has already been used' },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email },
            include: { accounts: true },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if user has a credentials account
        const credentialsAccount = user.accounts.find(
            (acc) => acc.provider === 'credentials'
        )

        if (!credentialsAccount) {
            return NextResponse.json(
                { error: 'This account uses social login. Password reset is not available.' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Update password and mark token as used
        await prisma.$transaction([
            prisma.account.update({
                where: { id: credentialsAccount.id },
                data: {
                    access_token: hashedPassword,
                },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ])

        return NextResponse.json({
            message: 'Password reset successful. You can now sign in with your new password.',
        })
    } catch (error) {
        console.error('Error resetting password:', error)
        return NextResponse.json(
            { error: 'An error occurred while resetting your password' },
            { status: 500 }
        )
    }
}
