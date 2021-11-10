import mongoose from "mongoose"


const {Schema, model} = mongoose
const commentSchema = new Schema({
    author: {type: String, required: true},
    content: {type: String, required: true},

},{
    timestamps: true
})

export default model("Comment", commentSchema)