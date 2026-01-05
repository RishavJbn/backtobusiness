import { Task } from "../models/Task";


const getDashboardData = async (res,req) =>{
    try {
        
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const getUserDashboardData = async (res,req) =>{
    try {
        
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const getTasks = async (res,req) =>{
    try {
        const {status} = req.query;
        let filter = {};

      if(status){
        filter.status = status;
      }
      let tasks;

      if(req.user.role === "admin"){
        tasks = await Task.find(filter).populate(
          "assignedTo",
          "name email profiileImageUrl"
        )
      }
        else {
          tasks = await Task.find(
            { ...filter, assignedTo: req.user._id }.populate(
              "assignedTo",
              "name email profiileImageUrl"
            )
          );
        }
        // add completed todo checklist count to each task
        tasks = await Promise.all(
          tasks.map(async (task)=>{
            const completedCount = task.todoChecklist.filter((item) => item.completed).length;
            return { ...task._doc, completedTodoCount : completedCount}
          })
        );

        //status summary counts
        const allTasks = await Task.countDocuments(req.user.role === "admin" ? {} : {assignedTo:req.user._id});

        const pendingTasks = await Task.countDocuments({
          ...filter,
          status:"pending",
          ...(req.user.role !== "admin" && { assignedTo: req.user._id})
        });

         const inProgressTasks = await Task.countDocuments({
           ...filter,
           status: "In Progress",
           ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
         });

          const completedTasks = await Task.countDocuments({
            ...filter,
            status: "completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
          });

          res.json({
            tasks,
            all: allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks
          });
    }
     catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const getTaskById = async (res,req) =>{
    try {
        
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const createTask = async (res,req) =>{
    try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist
    } = req.body;  
    if(!Array.isArray(assignedTo)){
      return res.status(400).json({message:"assigned must be an array of user IDs"});async 
    }

    const task = await Task.create({
       title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
      createdBy: req.user._id
    });

    res.status(201).json({message:"Task created Successfully", task});
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const updateTask = async (res,req) =>{
    try {
        
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const deleteTask = async (res,req) =>{
    try {
        
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const updateTaskStatus = async (res,req) =>{
    try {
        
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}

const updateTaskChecklist = async (res,req) =>{
    try {
        
    } catch (error) {
      return res.status(500).json({message: "Server Error",error: error.message});  
    }
}


export {getUserDashboardData,getDashboardData,getTaskById,getTasks,createTask,updateTask,deleteTask,updateTaskStatus,updateTaskChecklist}