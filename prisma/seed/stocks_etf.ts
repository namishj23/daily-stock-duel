import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const filePath = path.join(
    process.cwd(),
    "prisma/seed/data/MW-ETF-26-Jan-2026.csv"
);

// Tune this if needed (25–100 is safe for Neon)
const BATCH_SIZE = 50;

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());

    return result;
}

async function main() {
    console.log("🌱 Seeding NSE ETFs...");

    // Read file content
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    // The header has embedded newlines in quoted strings, so find where actual data starts
    // Data rows start with a symbol like "SILVER360" which doesn't contain newlines
    const lines = content.split('\n');

    const etfs: { symbol: string; name: string }[] = [];

    // Skip header (first 18 lines based on the file structure - header ends at line 18)
    // Data starts from line 19 (0-indexed: 18)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines and header lines (headers contain newlines within quotes, making them multiline)
        if (!line) continue;

        // Parse CSV line
        const fields = parseCSVLine(line);

        // Valid data row should have a symbol (uppercase letters and numbers, no spaces/newlines)
        const symbol = fields[0]?.replace(/"/g, '').trim();
        const underlyingAsset = fields[1]?.replace(/"/g, '').trim();

        // Skip if symbol looks like a header or is invalid
        if (!symbol || symbol.includes(' ') || symbol.includes('\n') || symbol === 'SYMBOL') continue;

        // Only include if it looks like a valid ETF symbol
        if (/^[A-Z0-9]+$/.test(symbol) && underlyingAsset) {
            etfs.push({
                symbol: symbol,
                name: underlyingAsset.length > 50 ? underlyingAsset.substring(0, 47) + '...' : underlyingAsset,
            });
        }
    }

    console.log(`📈 ETFs found: ${etfs.length}`);

    if (etfs.length === 0) {
        console.log("No ETFs found in the CSV!");
        return;
    }

    // Show first few ETFs for verification
    console.log("First 5 ETFs:", etfs.slice(0, 5));

    // --------- WRITE TO DB (BATCHED) ---------
    for (let i = 0; i < etfs.length; i += BATCH_SIZE) {
        const batch = etfs.slice(i, i + BATCH_SIZE);

        await Promise.all(
            batch.map((etf) =>
                prisma.stock.upsert({
                    where: { symbol: etf.symbol },
                    update: {
                        name: etf.name,
                        isActive: true,
                    },
                    create: {
                        symbol: etf.symbol,
                        name: etf.name,
                    },
                })
            )
        );

        console.log(
            `✅ Inserted ${Math.min(i + BATCH_SIZE, etfs.length)} / ${etfs.length}`
        );
    }

    console.log("🎉 NSE ETF seeding completed successfully");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
