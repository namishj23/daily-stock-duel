import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-4">
                                <Shield className="w-4 h-4 text-success" />
                                <span className="text-sm font-medium text-success">Your Privacy Matters</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
                            <p className="text-muted-foreground">Last updated: January 2026</p>
                        </div>

                        <div className="prose prose-invert max-w-none space-y-6">
                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                                <p className="text-muted-foreground mb-4">We collect the following types of information:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li><strong>Account Information:</strong> Name, email address, profile picture (via Google OAuth)</li>
                                    <li><strong>Prediction Data:</strong> Your stock predictions, justifications, and submission times</li>
                                    <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited and features used</li>
                                    <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>To operate and improve the StockPredict platform</li>
                                    <li>To process your predictions and determine contest winners</li>
                                    <li>To communicate with you about your account and contest results</li>
                                    <li>To display leaderboards and statistics</li>
                                    <li>To prevent fraud and ensure fair play</li>
                                    <li>To comply with legal obligations</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                                <p className="text-muted-foreground mb-4">We may share your information with:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li><strong>Public Display:</strong> Your name and prediction statistics on leaderboards</li>
                                    <li><strong>Service Providers:</strong> Third-party services that help us operate the platform</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    We do NOT sell your personal information to third parties.
                                </p>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                                <p className="text-muted-foreground">
                                    We implement appropriate technical and organizational measures to protect your personal data, including:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                                    <li>Encryption of data in transit and at rest</li>
                                    <li>Secure authentication via Google OAuth</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Access controls and monitoring</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                                <p className="text-muted-foreground mb-4">You have the right to:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>Access the personal data we hold about you</li>
                                    <li>Request correction of inaccurate data</li>
                                    <li>Request deletion of your account and data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Export your prediction history</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
                                <p className="text-muted-foreground">
                                    If you have any questions about this Privacy Policy, please contact us at:
                                </p>
                                <p className="text-primary mt-2">privacy@stockpredict.in</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
