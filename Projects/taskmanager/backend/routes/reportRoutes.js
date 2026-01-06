import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import { exportTasksReport, exportUsersReport } from "../controllers/reportControllers";


const router = Router();

router.get("/export/tasks",protect,adminOnly,exportTasksReport);
router.get("/export/users",protect,adminOnly,exportUsersReport);

export default router;