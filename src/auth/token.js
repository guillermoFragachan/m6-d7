import createHttpError from "http-errors"
import UserModel from "../services/users/schema.js"
import { verifyJWT } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  // 1. If accessToken is not in cookies --> 401
  if (!req.cookies.accessToken) {
    next(createHttpError(401, "Please provide token in cookies!"))
  } else {
    try {
      // 2. If we've received the access token in cookies, we extract token from cooki
      const token = req.cookies.accessToken

      // 3. Verify token, if everything goes fine we are getting back the payload of the token ({_id: "iojasodjoasjd"}), otherwise an error will be thrown by jwt library
      const decodedToken = await verifyJWT(token)

      // 4. If token is valid we are going to attach him/her to request object
      const user = await UserModel.findById(decodedToken._id)
      if (user) {
        req.user = user
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