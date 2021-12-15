import express from "express"
import UserModel from "./schema.js"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { adminOnlyMiddleware } from "../../auth/admin.js"
import { JWTAuthenticate } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"



const usersRouter = express.Router()


//CREATE USER
usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()
    res.send({ _id })
  } catch (error) {
    next(error)
  }
})

/*


{
  "name": "guilermo",
  "surname": "fragachan",
  "email":"guill@frag.com",
  "password": "1111",
  "role": "Admin"
}


*/
//GET USER LIST
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

//GET SIGNED USER
usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

// usersRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
//     try {
//         const user = await UserModel.findById(req.params.id)
//         res.send(user)
//     } catch (error) {
//         next(error)
//     }
// })
//GET USER BY ID
usersRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})


//modify user 
usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    // req.user.name = "John"
    req.user.name = req.body.name
    // console.log(req.user)
    await req.user.save()
    res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:id", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:id", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Get credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      // 3. If credentials are fine we are going to generate an access token
      const accessToken = await JWTAuthenticate(user)
      res.send({ accessToken })
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter