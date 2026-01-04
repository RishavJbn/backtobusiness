import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import { deleteUser, getUserById, getUsers } from "../controllers/userControllers";


const router = Router();

router.get("/",protect,adminOnly,getUsers);
router.get("/:id",protect,getUserById);
router.get("/:id",protect,adminOnly,deleteUser);

export {router};