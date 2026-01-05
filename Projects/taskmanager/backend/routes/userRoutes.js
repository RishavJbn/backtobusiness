import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {  getUserById, getUsers } from "../controllers/userControllers.js";


const router = Router();

router.get("/",protect,adminOnly,getUsers);
router.get("/:id",protect,getUserById);


export default router;