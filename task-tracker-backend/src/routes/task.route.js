import { Router } from "express"
import { getAllTasks, addTask, updateTask, removeTask } from "../controllers/task.controller.js"
const router = Router()

router.get("/:type", getAllTasks)
router.patch("/:taskId", updateTask)
router.post("/", addTask)
router.delete("/:taskId", removeTask)

export default router;