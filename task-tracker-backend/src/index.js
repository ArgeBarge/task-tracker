import dotenv from 'dotenv'
import app from './app.js'

dotenv.config({
    path: './.env'
})

const startServer = async () => {
    try {
        app.on("error", (error) => {
            console.log("ERROR", error)
            throw error;
        })

        console.log(`${process.env.PORT}`);
        
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running n port : ${process.env.PORT}`);
            
        },)
    } catch (error) {
        console.log("Mongo DB connection failed!", error)
    }
}

startServer();