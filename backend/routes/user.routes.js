const express = require("express");
const prisma = require("../prismaclient");

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  const { email, name, ageConfirmed } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        ageConfirmed
      }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Leaderboard
router.get("/leaderboard", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { wins: "desc" },
    select: {
      id: true,
      name: true,
      wins: true
    }
  });

  res.json(users);
});

module.exports = router;
