import express from "express";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hello world ");
});

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  connectDB();
  console.log("Connected to DB");
  console.log(`Listening on PORT : ${PORT}`);
});
