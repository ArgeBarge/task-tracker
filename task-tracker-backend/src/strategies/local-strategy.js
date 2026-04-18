import passport from 'passport'
import { Strategy } from 'passport-local'
import { findUser, findUserById } from '../model/userModel.js'

// takes user object and stores it in the session
passport.serializeUser((user, done) => {
    console.log(`Inside serialize user`)
    console.log(user)
    done(null, user.id)
})

// unpack who the user is, takes user object and stores into request object
passport.deserializeUser(async (id, done) => {
    console.log("Inside deserializer");
    console.log(`User ID ${id}`)
    try {
        const user = await findUserById(id);

        if(!user)
            throw new Error("User not found!")

        done(null, user);
    } catch (error) {
        done(error, null);
    }
})

export default passport.use(
    new Strategy(async (username, password, done) => {
        console.log(`username: ${username}, password: ${password}`)
        try {
            const user = await findUser(username);
            console.log(user);
            if(!user) 
                return done(null, false, {message: "User not found!", status: 404 })
            
            if(user.password !== password)
                return done(null, false, {message: "Invalid credentials", status: 401 })


            done(null, user)
        } catch (error) {
            done(error, null)
        }
        
    })
)
