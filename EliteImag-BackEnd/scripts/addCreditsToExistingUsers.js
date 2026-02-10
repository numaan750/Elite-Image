import mongoose from "mongoose";
import loginUserSchema from "../models/loginUser.js";
import dotenv from "dotenv";

dotenv.config();

const addCreditsToUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Database connected");

    const result = await loginUserSchema.updateMany(
      { credits: { $exists: false } },
      { $set: { credits: 15 } },
    );

    console.log(`✅ Updated ${result.modifiedCount} users with 15 credits`);

    const result2 = await loginUserSchema.updateMany(
      { $or: [{ credits: null }, { credits: undefined }] },
      { $set: { credits: 15 } },
    );

    console.log(
      `✅ Updated ${result2.modifiedCount} null/undefined credit users`,
    );

    mongoose.disconnect();
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

addCreditsToUsers();
