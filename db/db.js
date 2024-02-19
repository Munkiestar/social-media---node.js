import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b2fal60.mongodb.net/social?retryWrites=true&w=majority`,
    );
    console.log("Database connected successfully");
  } catch (err) {
    console.log("database not connected: ", err);
  }
};

export default connectDB;
