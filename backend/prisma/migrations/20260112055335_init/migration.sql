-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('UP', 'DOWN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ageConfirmed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPrediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stock" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,
    "justification" TEXT NOT NULL,
    "entryFeePaid" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contestDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyResult" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "winnerId" TEXT NOT NULL,
    "profitPct" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DailyResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPrediction_userId_contestDate_key" ON "DailyPrediction"("userId", "contestDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyResult_date_key" ON "DailyResult"("date");

-- AddForeignKey
ALTER TABLE "DailyPrediction" ADD CONSTRAINT "DailyPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyResult" ADD CONSTRAINT "DailyResult_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
