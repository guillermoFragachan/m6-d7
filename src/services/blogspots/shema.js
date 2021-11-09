import mongoose from "mongoose"

const { Schema, model } = mongoose


const blogpostSchema = new Schema(
    {
      category: { type: String, required: true },
      title: { type: String, required: true },
      cover: { type: String, required: true },
        content: { type: String, required: true },
      age: { type: Number, min: 18, max: 65, required: true },
      professions: [String],
    },
    {
      timestamps: true,
    }
  )







export default model("Blogpost", blogpostSchema)