import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../src/index.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'StockPredict - Daily Contest',
    description: 'Predict stock movements and win daily prizes',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        {children}
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    )
}
// trigger
