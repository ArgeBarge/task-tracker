import { getTasks, getCompletedTasks, getExpiredTasks, getCurrentTasks, insertTask, modifyTask, deleteTask } from "../model/taskModel.js"
import dayjs from 'dayjs'
import { getAllUsers } from "../model/userModel.js";

const formatTasksForResponse = async (tasks) => {
    let currentTasks = [];
    let completedTasks = [];
    let expiredTasks = [];
    let newTasks = [];

    tasks.map((task) => {
        if(task.taskName === null && task.expiryDate === null) {
            newTasks.push(task)
        }
        else if(task.completer_username !== null) {
            completedTasks.push(task);
        }
        else if (dayjs().diff(task.expiryDate) > 0 && task.completer_username === null)  {
            expiredTasks.push(task)
        } 
        else if (dayjs().diff(task.expiryDate) < 0 && task.completer_username === null) {
            currentTasks.push(task)
        }
    })

    currentTasks.sort((task_1, task_2) => {
        return dayjs(task_1.expiryDate).diff(task_2.expiryDate)
    })

    expiredTasks.sort((task_1, task_2) => {
        return dayjs(task_1.expiryDate).diff(task_2.expiryDate)
    })

    completedTasks.sort((task_1, task_2) => {
        return dayjs(task_1.expiryDate).diff(task_2.expiryDate)
    })

    newTasks.sort((task_1, task_2) => {
        return dayjs(task_1.expiryDate).diff(task_2.expiryDate)
    })

    const possibleAssignees = await getAllUsers();
    possibleAssignees.map
    newTasks.map((task) => {
        task.taskName="New Task"
        task.expiryDate=dayjs()

        task.ASIGNEES = possibleAssignees.map((assignee) => {
            return assignee.username
        })

        console.log(task.ASIGNEES)
        
    })


    console.log("current tasks" + currentTasks);
    console.log("expired tasks", + expiredTasks);
    console.log("completed tasks", + completedTasks);
    console.log("new tasks", + newTasks);

    return [currentTasks, completedTasks, expiredTasks, newTasks];
}
const getAllTasks = async (req, res) => {
    try {
        console.log("Entering function", req.params.type)
        let tasks;
        switch(req.params.type) {
            case "all":
                tasks = await getTasks();
                const [currentTasks, completedTasks, expiredTasks, newTasks] = await formatTasksForResponse(tasks)
                res.status(200).json({
                    "current_tasks": currentTasks,
                    "expired_tasks": expiredTasks,
                    "completed_tasks": completedTasks,
                    "new_tasks": newTasks
                })
                break;
            case "completed":
                tasks = await getCompletedTasks();
                res.status(200).json(tasks)
                break;
            case "expired":
                tasks = await getExpiredTasks();
                res.status(200).json(tasks);
                break;
            case "current":
                tasks = await getCurrentTasks();
                res.status(200).json(tasks);
                break;
            default:
                res.status(400).json({
                    message: "Invalid request type"
                });

        }
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const addTask = async (req, res) => {
    try {
        console.log(req.body)
        const result = await insertTask(req.body);
        
        res.sendStatus(200);


    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const updateTask = async (req, res) => {
    try {

        if(!req.params.taskId)
            return res.status(400).json({message: "no task id provided"})

        if(Object.keys(req.body).length === 0)
            return res.status(400).json({message: "no fields to update"})

        const result = await modifyTask(req)

        res.status(200).json("fields updated");

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const removeTask = async (req, res) => {

    try {
        if(!req.params.taskId)
            return res.status(400).json({message: "no task id provided"})

        const result = await deleteTask(req.params.taskId)

        res.status(200).json({
            message: "task deleted"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
    

}

export {
    getAllTasks,
    addTask,
    updateTask,
    removeTask
}