import { getAllUsers, insertUser } from "../model/userModel.js"

const getUsers = async (req, res) => {
    try {
        if(!req.user)
            throw new Error("Not logged in")
        const users = await getAllUsers();

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const addUser = async (req, res) => {
    try {
        const result = await insertUser(req.body)
        console.log(result)
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export {
    getUsers,
    addUser
}