import mongoose from "mongoose"

const { Schema, model } = mongoose


const blogpostSchema = new Schema(
    {
      category: { type: String, required: true },
      title: { type: String, required: true },
      cover: { type: String },
        content: { type: String, required: true },
        authors: { type: Schema.Types.ObjectId, ref: "User" },
        
        comments: [
          {
            author: { type: String },
            content: { type: String }
          }
        ],
    },
    {
      timestamps: true,
    }
  )







export default model("Blogpost", blogpostSchema)