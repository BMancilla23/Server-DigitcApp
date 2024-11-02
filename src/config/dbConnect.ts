import mongoose from "mongoose";

const dbConnect = async () => {
  const DB_URL = process.env.DB_URL as string;
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

export default dbConnect;
