import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import cors from "cors"

import usersRouter from "./services/users/index.js"
import passport from "passport"
import googleCloudStrategy from "./auth/oauth.js"

import blogspotRouter from "./services/blogspots/index.js"
import authorsRouter from "./services/authors/index.js"

import { unauthorizedHandler, forbiddenHandler, catchAllHandler } from "./errorHandles.js"



const server = express()

server.use(cors())
server.use(express.json())
passport.use("google", googleCloudStrategy)

server.use(passport.initialize())


const port = 3001


server.use("/author", authorsRouter)
server.use("/blogspot", blogspotRouter)
server.use("/users", usersRouter)


server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

mongoose.connect(process.env.URL)

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected!")

server.listen(port, () => {
    console.table(listEndpoints(server))

    console.log(`Server running on port ${port}`)
  })
})
