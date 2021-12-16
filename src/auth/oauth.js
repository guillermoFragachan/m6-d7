import passport from "passport";

import GoogleSrategy from "passport-google-oauth20";
import Usermodel from "../services/users/schema.js"
import { JWTAuthenticate } from "./tools.js";

const googleCloudStrategy = new GoogleSrategy(
    {
        clientID: process.env.GOOGLE_OAUTH_ID,
        clientSecret: process.env.GOOGLE_OAUTH_SECRET,
        callbackURL: `${process.env.API_URL}/users/googleRedirect`,
      },
    async (accesToken, refreshToken, profile, passportNext) =>{
        try{

            console.log("Google profile: ", profile)
            const user = await Usermodel.findOne({googleId: profile.id})
            if (user){
                const tokens = await JWTAuthenticate(user)
                passportNext(null, {tokens})
            }else{
                const newUser = new Usermodel({
                    name: profile.name.givenName,
                    surname: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                  })
          
                  const savedUser = await newUser.save()
          
                  const tokens = await JWTAuthenticate(savedUser)
          
                  // 4. passportNext()
                  passportNext(null, { tokens })
            }

        }catch(error){
        passportNext(error)

        }
    }
)

passport.serializeUser(function (data, passportNext) {
    passportNext(null, data)
  })
  
  export default googleCloudStrategy