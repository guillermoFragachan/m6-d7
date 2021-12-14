import express from "express"
import UserModel from "./schema.js"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { adminOnlyMiddleware } from "../../auth/admin.js"

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
usersRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

//GET SIGNED USER
usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
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
usersRouter.get("/:id", basicAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})


//modify user 
usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    // req.user.name = "John"
    console.log(req.user)
    await req.user.save()
    res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:id", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:id", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

export default usersRouter