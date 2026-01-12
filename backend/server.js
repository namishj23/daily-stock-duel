const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const predictionRoutes = require("./routes/prediction.routes");
const resultRoutes = require("./routes/result.routes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/results", resultRoutes);

app.get("/", (req, res) => {
  res.send("Daily Stock Duel Backend 🚀");
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
