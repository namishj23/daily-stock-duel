import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { accounts: true },
                })

                if (!user) {
                    throw new Error('No user found with this email')
                }

                const credentialsAccount = user.accounts.find(
                    (acc) => acc.provider === 'credentials'
                )

                if (!credentialsAccount?.access_token) {
                    throw new Error('Please sign in with Google')
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    credentialsAccount.access_token
                )

                if (!isValid) {
                    throw new Error('Invalid password')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Allow all sign-ins
            return true
        },
        async redirect({ url, baseUrl }) {
            // Redirect to predict page after sign-in
            if (url.startsWith('/')) return `${baseUrl}${url}`
            if (url.startsWith(baseUrl)) return url
            return `${baseUrl}/predict`
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    debug: process.env.NODE_ENV === 'development',
}
