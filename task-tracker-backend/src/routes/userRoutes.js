import { Router } from "express";
import { addUser, getUsers } from "../controllers/userController.js";
const router = Router();

router.get("/", getUsers);
router.post("/", addUser)

export default router;