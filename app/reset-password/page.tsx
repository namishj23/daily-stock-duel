'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Eye, EyeOff, Lock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const { toast } = useToast()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [tokenError, setTokenError] = useState(false)

    useEffect(() => {
        if (!token) {
            setTokenError(true)
        }
    }, [token])

    const getPasswordStrength = (pass: string) => {
        if (pass.length === 0) return { strength: 0, label: '', color: '' }
        if (pass.length < 8) return { strength: 1, label: 'Too Short', color: 'text-destructive' }

        let strength = 1
        if (pass.length >= 12) strength++
        if (/[A-Z]/.test(pass)) strength++
        if (/[0-9]/.test(pass)) strength++
        if (/[^A-Za-z0-9]/.test(pass)) strength++

        if (strength <= 2) return { strength: 2, label: 'Weak', color: 'text-warning' }
        if (strength <= 3) return { strength: 3, label: 'Good', color: 'text-primary' }
        return { strength: 4, label: 'Strong', color: 'text-success' }
    }

    const passwordStrength = getPasswordStrength(password)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: 'Passwords do not match',
                description: 'Please make sure both passwords are identical',
                variant: 'destructive',
            })
            return
        }

        if (password.length < 8) {
            toast({
                title: 'Password too short',
                description: 'Password must be at least 8 characters',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            })

            const data = await res.json()

            if (res.ok) {
                setIsSuccess(true)
                toast({
                    title: 'Password reset successful! 🎉',
                    description: 'You can now sign in with your new password',
                })

                // Redirect to signin after 2 seconds
                setTimeout(() => {
                    router.push('/signin')
                }, 2000)
            } else {
                toast({
                    title: 'Reset failed',
                    description: data.error || 'Something went wrong',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to reset password. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="glass rounded-2xl border border-destructive/50 p-8 shadow-elevated text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3">Invalid Reset Link</h2>

                        <p className="text-muted-foreground mb-6">
                            This password reset link is invalid or has expired.
                        </p>

                        <div className="space-y-3">
                            <Link href="/forgot-password">
                                <Button variant="hero" className="w-full">
                                    Request New Reset Link
                                </Button>
                            </Link>
                            <Link href="/signin">
                                <Button variant="outline" className="w-full">
                                    Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="glass rounded-2xl border border-success/50 p-8 shadow-elevated text-center">
                        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-success" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3">Password Reset Complete!</h2>

                        <p className="text-muted-foreground mb-6">
                            Your password has been successfully reset. You can now sign in with your new password.
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Redirecting to sign in page...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="glass rounded-2xl border border-border/50 p-8 shadow-elevated">
                    {/* Logo & Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-[hsl(172_66%_50%)] flex items-center justify-center mb-4 shadow-glow">
                            <Lock className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold">Reset Password</h1>
                        <p className="text-muted-foreground text-center">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-muted/50 border-border/50 rounded-xl pr-12"
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password.length > 0 && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                                        ? level <= 2
                                                            ? 'bg-destructive'
                                                            : level === 3
                                                                ? 'bg-warning'
                                                                : 'bg-success'
                                                        : 'bg-muted'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs ${passwordStrength.color}`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider text-muted-foreground">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 bg-muted/50 border-border/50 rounded-xl pr-12"
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-destructive">Passwords do not match</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="hero"
                            className="w-full h-12 text-base font-semibold rounded-xl"
                            disabled={isLoading || password !== confirmPassword || password.length < 8}
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </form>

                    {/* Back to Sign In */}
                    <div className="mt-6 text-center">
                        <Link href="/signin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Remember your password? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
