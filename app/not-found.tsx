import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h1 className="text-6xl font-bold mb-4">404</h1>
                    <p className="text-xl text-muted-foreground mb-8">Page not found</p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    )
}
