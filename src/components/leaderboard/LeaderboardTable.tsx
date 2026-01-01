import { Trophy, TrendingUp, TrendingDown, Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - will be replaced with real data from database
const mockLeaderboard = [
  {
    id: "1",
    rank: 1,
    name: "Rahul Sharma",
    avatar: "RS",
    stock: "RELIANCE",
    direction: "UP",
    percentChange: 3.42,
    totalWins: 15,
    accuracy: 72.5,
    submittedAt: "09:02 AM",
  },
  {
    id: "2",
    rank: 2,
    name: "Priya Patel",
    avatar: "PP",
    stock: "TCS",
    direction: "UP",
    percentChange: 2.89,
    totalWins: 12,
    accuracy: 68.3,
    submittedAt: "09:05 AM",
  },
  {
    id: "3",
    rank: 3,
    name: "Amit Kumar",
    avatar: "AK",
    stock: "INFY",
    direction: "DOWN",
    percentChange: 2.15,
    totalWins: 8,
    accuracy: 65.0,
    submittedAt: "09:12 AM",
  },
  {
    id: "4",
    rank: 4,
    name: "Sneha Reddy",
    avatar: "SR",
    stock: "HDFCBANK",
    direction: "UP",
    percentChange: 1.98,
    totalWins: 6,
    accuracy: 61.2,
    submittedAt: "09:18 AM",
  },
  {
    id: "5",
    rank: 5,
    name: "Vikram Singh",
    avatar: "VS",
    stock: "ICICIBANK",
    direction: "UP",
    percentChange: 1.75,
    totalWins: 4,
    accuracy: 58.7,
    submittedAt: "09:22 AM",
  },
];

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-secondary" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-mono">{rank}</span>;
  }
}

export function LeaderboardTable() {
  return (
    <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-secondary" />
          <div>
            <h3 className="font-semibold text-lg">Today's Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Updated at market close</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Prize Pool</div>
          <div className="text-xl font-bold text-gradient-gold mono">₹500</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b border-border/50">
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Trader</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Direction</th>
              <th className="px-6 py-4 font-medium text-right">% Change</th>
              <th className="px-6 py-4 font-medium text-right">Accuracy</th>
              <th className="px-6 py-4 font-medium text-right">Wins</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((entry, index) => (
              <tr
                key={entry.id}
                className={cn(
                  "border-b border-border/30 transition-colors hover:bg-accent/50",
                  entry.rank === 1 && "winner-glow bg-secondary/5"
                )}
              >
                <td className="px-6 py-4">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-medium text-sm">
                      {entry.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-xs text-muted-foreground">Submitted {entry.submittedAt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono font-medium">{entry.stock}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    entry.direction === "UP" ? "badge-up" : "badge-down"
                  )}>
                    {entry.direction === "UP" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {entry.direction}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={cn(
                    "font-mono font-medium",
                    entry.percentChange > 0 ? "text-success" : "text-warning"
                  )}>
                    +{entry.percentChange.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-mono text-muted-foreground">{entry.accuracy.toFixed(1)}%</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-mono font-medium">{entry.totalWins}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
