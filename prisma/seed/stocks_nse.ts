import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const filePath = path.join(
  process.cwd(),
  "prisma/seed/data/nse_equities.csv"
);

// Tune this if needed (25–100 is safe for Neon)
const BATCH_SIZE = 50;

async function main() {
  console.log("🌱 Seeding NSE equities...");

  const stocks: { symbol: string; name: string }[] = [];

  // --------- READ CSV ---------
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: Record<string, string>) => {
        // Normalize headers: trim + uppercase
        const normalized: Record<string, string> = {};
        for (const key of Object.keys(row)) {
          normalized[key.trim().toUpperCase()] = row[key];
        }

        const series = normalized["SERIES"];

        if (series && series.trim().toUpperCase() === "EQ") {
          const symbol = normalized["SYMBOL"];
          const name = normalized["NAME OF COMPANY"];

          if (symbol && name) {
            stocks.push({
              symbol: symbol.trim(),
              name: name.trim(),
            });
          }
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`📈 EQ stocks found: ${stocks.length}`);

  // --------- WRITE TO DB (BATCHED) ---------
  for (let i = 0; i < stocks.length; i += BATCH_SIZE) {
    const batch = stocks.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map((stock) =>
        prisma.stock.upsert({
          where: { symbol: stock.symbol },
          update: {
            name: stock.name,
            isActive: true,
          },
          create: {
            symbol: stock.symbol,
            name: stock.name,
          },
        })
      )
    );

    console.log(
      `✅ Inserted ${Math.min(i + BATCH_SIZE, stocks.length)} / ${stocks.length}`
    );
  }

  console.log("🎉 NSE stock seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
