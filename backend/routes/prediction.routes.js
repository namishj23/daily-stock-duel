const express = require("express");
const prisma = require("../prismaclient");

const router = express.Router();

// Submit daily prediction
router.post("/", async (req, res) => {
  const { userId, stock, direction, justification, contestDate } = req.body;

  try {
    const prediction = await prisma.dailyPrediction.create({
      data: {
        userId,
        stock,
        direction,
        justification,
        contestDate: new Date(contestDate)
      }
    });

    res.json(prediction);
  } catch (err) {
    res.status(400).json({
      error: "Prediction already submitted for today"
    });
  }
});

// Get user's prediction for a day
router.get("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;

  const prediction = await prisma.dailyPrediction.findUnique({
    where: {
      userId_contestDate: {
        userId,
        contestDate: new Date(date)
      }
    }
  });

  res.json(prediction);
});

module.exports = router;
