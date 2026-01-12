const express = require("express");
const prisma = require("../prismaclient");

const router = express.Router();

// Declare winner for the day (ADMIN / CRON)
router.post("/declare", async (req, res) => {
  const { date, winnerId, profitPct } = req.body;

  try {
    // Save daily result
    const result = await prisma.dailyResult.create({
      data: {
        date: new Date(date),
        winnerId,
        profitPct
      }
    });

    // Increment winner wins
    await prisma.user.update({
      where: { id: winnerId },
      data: { wins: { increment: 1 } }
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Result already declared" });
  }
});

// Get result by date
router.get("/:date", async (req, res) => {
  const result = await prisma.dailyResult.findUnique({
    where: { date: new Date(req.params.date) },
    include: {
      winner: {
        select: { name: true }
      }
    }
  });

  res.json(result);
});

module.exports = router;
