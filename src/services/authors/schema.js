import mongoose from "mongoose"


const {Schema, model} = mongoose
const authorsSchema = new Schema({
    name: {},
    surname: {},

})

export default model("Authors", authorsSchema)