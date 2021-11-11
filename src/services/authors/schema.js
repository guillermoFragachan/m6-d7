import mongoose from "mongoose"


const {Schema, model} = mongoose
const authorsSchema = new Schema({
    name: {},
    surname: {},

},{
    timestamps: true
})

export default model("Authors", authorsSchema)