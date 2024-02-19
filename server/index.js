import express from "express";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.js";

import authRoute from "./routes/auth.js";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hello world ");
});

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Listening on PORT : ${PORT}`);
});

// nastaviti
// https://youtu.be/4xidxpXlzUU?t=6295
