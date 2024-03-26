import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default:'https://cdn.pixabay.com/photo/2021/09/20/03/24/skeleton-6639547_1280.png',
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
