import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AlertTriangle } from 'lucide-react'

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 mb-4">
                                <AlertTriangle className="w-4 h-4 text-warning" />
                                <span className="text-sm font-medium text-warning">Important</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Disclaimer</h1>
                            <p className="text-muted-foreground">Last updated: January 2026</p>
                        </div>

                        <div className="prose prose-invert max-w-none space-y-6">
                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">Skill-Based Contest</h2>
                                <p className="text-muted-foreground">
                                    StockPredict is a skill-based prediction contest designed for entertainment and educational purposes.
                                    Participants use their knowledge of market trends, technical analysis, and fundamental analysis to make
                                    predictions about stock movements. Success in this contest requires skill, research, and analytical abilities.
                                </p>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">Not Investment Advice</h2>
                                <p className="text-muted-foreground">
                                    The predictions, analyses, and discussions on this platform do NOT constitute investment advice,
                                    financial advice, trading advice, or any other sort of advice. You should not treat any of the
                                    content on this platform as such. StockPredict does not recommend that any stock, security, or
                                    other investment should be bought, sold, or held by you.
                                </p>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">Risk Warning</h2>
                                <p className="text-muted-foreground mb-4">
                                    Trading in stock markets involves substantial risk of loss and is not suitable for every investor.
                                    The valuation of stocks may fluctuate, and as a result, investors may lose more than their original investment.
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>Past performance is not indicative of future results</li>
                                    <li>You may lose some or all of your invested capital</li>
                                    <li>You should only invest money that you can afford to lose</li>
                                    <li>Seek independent financial advice if you have any doubts</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">No Liability</h2>
                                <p className="text-muted-foreground">
                                    StockPredict and its operators shall not be liable for any loss or damage, including without limitation,
                                    any loss of profit, which may arise directly or indirectly from use of or reliance on information
                                    provided on this platform. Under no circumstances shall StockPredict be liable for any direct, indirect,
                                    incidental, special, or consequential damages arising out of participation in the contest.
                                </p>
                            </section>

                            <section className="p-6 rounded-2xl bg-warning/5 border border-warning/20">
                                <h2 className="text-xl font-semibold mb-4 text-warning">Regulatory Notice</h2>
                                <p className="text-muted-foreground">
                                    StockPredict operates as a skill-based contest platform. For any actual investment decisions,
                                    please consult with a SEBI-registered investment advisor. We are not registered with SEBI
                                    or any other regulatory body as investment advisors.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
