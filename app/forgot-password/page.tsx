'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (res.ok) {
                setIsSubmitted(true)
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Something went wrong',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to send reset email. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="glass rounded-2xl border border-border/50 p-8 shadow-elevated text-center">
                        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-success" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>

                        <p className="text-muted-foreground mb-6">
                            If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
                        </p>

                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-left mb-6">
                            <p className="font-medium mb-2">📧 Next Steps:</p>
                            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                <li>Check your inbox (and spam folder)</li>
                                <li>Click the reset link in the email</li>
                                <li>Create a new password</li>
                            </ol>
                        </div>

                        <p className="text-xs text-muted-foreground mb-6">
                            The reset link will expire in 1 hour for security reasons.
                        </p>

                        <Link href="/signin">
                            <Button variant="outline" className="w-full">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Sign In
                            </Button>
                        </Link>
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
                            <TrendingUp className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold">Forgot Password?</h1>
                        <p className="text-muted-foreground text-center">
                            No worries! Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 pl-12 bg-muted/50 border-border/50 rounded-xl"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="hero"
                            className="w-full h-12 text-base font-semibold rounded-xl"
                            disabled={isLoading || !email}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>

                    {/* Back to Sign In */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/signin"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
