import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"]
    })
);

//database connection
connectDB();

//middleware
app.use(express.json());

//routes
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/tasks",taskRoutes);
//app.use("/api/reports",reportRoutes);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));