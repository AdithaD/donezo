import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI ?? "", {}).then(() => {
  console.log("Database connected successfully");
});
