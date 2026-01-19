import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(172_66%_50%)] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">StockPredict</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              India's premier daily stock prediction contest. Test your market skills and win daily prizes.
            </p>
          </div>

          {/* Contest */}
          <div>
            <h4 className="font-semibold mb-4">Contest</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/predict" className="hover:text-foreground transition-colors">Make Prediction</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:support@stockpredict.in" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} StockPredict. All rights reserved.</p>
            <p className="text-center md:text-right">
              This is a skill-based contest. Not investment advice. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
