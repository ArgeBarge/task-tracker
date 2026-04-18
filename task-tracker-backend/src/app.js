import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import localStrategy from './strategies/local-strategy.js'
import ical from 'ical-generator'
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

const app = express();

app.use(express.json())
app.use(cookieParser("secret"))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60
        }
    })
)

app.use(passport.initialize());
app.use(passport.session());

import taskRoutes from './routes/task.route.js'
import userRoutes from './routes/userRoutes.js'
import { getCurrentTasks } from './model/taskModel.js'

function checkAuth(req, res, next) {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({
        message: "Unauthorised"
    })
}
app.use('/api/tasks', checkAuth, taskRoutes)
app.use('/api/users', checkAuth, userRoutes)

app.post('/api/auth', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({
                message: "internal server error"
            })
        }

        if(!user) {
            return res.status(401).json({
                message: "Authentication failed"
            })
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({
                    message: "login failed"
                })
            }
            console.log(user)
            return res.status(200).json({
                message: "Authenticated",
                userData: {
                    id: user.id,
                    username: user.username
                }

            })
        })

       
    })(req, res)
})

app.get('/api/auth/status', (req, res) => {
    console.log("Inside status endpoint")
    console.log(req.user)
    console.log(req.session)
    if(req.user)
    {
        return res.status(200).json({
            id: req.user.id,
            username: req.user.username
        })
    }
       // return res.send(req.user);

    

    return res.sendStatus(401)
})

app.post('/api/auth/logout', (req, res) => {
    if(!req.user)
        return res.sendStatus(401);

    req.logout((err) => {
        if (err)
            return res.sendStatus(400)
    })

    res.sendStatus(200);
})

app.get('/api/calendar.ics', async (req, res) => {
    const cal = ical({ name: "task calendar"})
    const tasks = await getCurrentTasks();

    
    console.log(tasks[0].expiryDate)
    tasks.map((task) => {
        const expiryDate = new Date(task.expiryDate);
        const endExpiryDate = new Date(expiryDate.getTime() + 900000)
        cal.createEvent({
            id: `task-${task.taskId}`,
            start: expiryDate,
            end: endExpiryDate,
            summary: task.taskName,
        })
    })

    res.setHeader("Content-Type", "text/calendar")
    res.send(cal.toString())
})

export default app;