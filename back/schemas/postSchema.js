import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    mainImage: String,
    title: String,
    galleryImage1: String,
    galleryImage2: String,
    galleryImage3: String,
    price: Number,
    description: String,
    slug: String,
    categories: Array,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);

export default PostModel;
