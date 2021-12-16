import jwt from "jsonwebtoken"

export const JWTAuthenticate = async user => {
  // 1. given the user generates token
  const accessToken = await generateJWTToken({ _id: user._id })
  return {accessToken}
}

const generateJWTToken = payload =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    })
  )

export const verifyJWT = token =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) rej(err)
      else res(decodedToken)
    })
  )

// generateJWTToken({ _id: "oasjidoasjdosaij" })
//   .then(token => console.log(token))
//   .catch(err => console.log(err))

// const token = await generateJWTToken({})

// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" })