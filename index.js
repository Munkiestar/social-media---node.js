import express from "express";
import connectDB from "./db/db.js";

import authRoute from "./routes/auth.js";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hello world ");
});

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  connectDB();
  console.log("Connected to DB");
  console.log(`Listening on PORT : ${PORT}`);
});
