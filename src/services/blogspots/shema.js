import mongoose from "mongoose"

const { Schema, model } = mongoose


const blogpostSchema = new Schema(
    {
      category: { type: String, required: true },
      title: { type: String, required: true },
      cover: { type: String, required: true },
        content: { type: String, required: true },
        authors: { type: Schema.Types.ObjectId, ref: "Authors" },
        
        comments: [
          {
            author: { type: String, required: true },
            content: { type: String, required: true }
          }
        ],
    },
    {
      timestamps: true,
    }
  )







export default model("Blogpost", blogpostSchema)