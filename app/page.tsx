import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { RulesSection } from '@/components/home/RulesSection'
import { CTASection } from '@/components/home/CTASection'

export default function Home() {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <HeroSection />
                <HowItWorksSection />
                <RulesSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}
