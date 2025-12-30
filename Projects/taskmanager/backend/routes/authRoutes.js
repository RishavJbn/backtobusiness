import { Router } from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/authControllers";

const router = Router;

//Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
