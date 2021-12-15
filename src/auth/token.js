import createHttpError from "http-errors"
import UserModel from "../services/users/schema.js"
import { verifyJWT } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  // 1. Check if Authorization header is received, if it is not --> 401
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide token in Authorization header!"))
  } else {
    try {
      // 2. If we've received the Authorization header, we extract token from header
      const token = req.headers.authorization.replace("Bearer ", "") // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWI4NzE2NDNjMGQ1YzE3Mjc2MzMwZjkiLCJpYXQiOjE2Mzk1NjA4OTksImV4cCI6MTYzOTU2MTc5OX0.6OAA2FdixQx1fG-y0RRddQvOnEOQxPIMvzMYPBoPFO0"

      // 3. Verify token, if everything goes fine we are getting back the payload of the token ({_id: "iojasodjoasjd"}), otherwise an error will be thrown by jwt library
      const decodedToken = await verifyJWT(token)
      console.log(token)

      // 4. If token is valid we are going to attach him/her to request object
      const user = await UserModel.findById(decodedToken._id)

      if (user) {
        req.user = user
        console.log(user)

        next()
      } else {
        next(createHttpError(404, "User not found"))
      }
    } catch (error) {
      // 5. In case of error --> 401
      next(createHttpError(401, "Token not valid!"))
    }
  }
}