import { Task } from "../models/Task.js";

const getDashboardData = async (res, req) => {
  try {
    //fetch statistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({status:"Pending"});
    const completedTasks = await Task.countDocuments({status: "Completed"});
    const overdueTasks = await Task.countDocuments({status:{ $ne: "Completed"},
      dueDate:{$lt: new Date()},
  });

  //Ensure all possible statuses are included
  const taskStatuses = ["Pending","In Progress","Completed"];
  const taskDistributionRaw = await Task.aggregate([
    {
      $group:{
        _id: "$status",
        count : { $sum: 1}
      }
    }
  ]);

  const taskDistribution =taskStatuses.reduce((acc,status) => {
    const formattedKey = status.replace(/\s+/g,"");//remove spaces for responses keys
    acc[formattedKey]= taskDistributionRaw.find((item) => item._id === status)?.count || 0;
    return acc;
  },{});

  taskDistribution["All"] = totalTasks; //add total count to task distribution 
  //Ensure all priority levels are included
  const taskPriorities = ["Low","Medium","High"];
  const taskPriorityLevelsRaw = await Task.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);
  const taskPriorityLevels = taskStatuses.reduce((acc, priority) => {
  
    acc[priority] =
      taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
    return acc;
  }, {});

  //fetch recent 10 tasks
  const recentTasks = await Task.find()
  .sort({createdAt: -1})
  .limit(10)
  .select("title status priority dueDate createdAt");

  res.status(200).json({
    statistics:{
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks
    },
    charts: {
      taskDistribution,
      taskPriorityLevels
    },
    recentTasks,
  });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getUserDashboardData = async (res, req) => {
  try {
    const userId = req.user._id; // only fetched data for logged user
    //fetch statistics for user-specific tasks
    const totalTasks = await Task.countDocuments({assignedTo: userId});
    const pendingTasks = await Task.countDocuments({assignedTo: userId, status:"Pending"});
    const completedTasks = await Task.countDocuments({assignedTo: userId, status:"Completed"});
    const overdueTasks = await Task.countDocuments({assignedTo: userId ,
      status:{$ne:"Completed"},
      dueDate:{$lt:new Date()}
    });

    //Task distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $match:{assignedTo: userId}
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //remove spaces for responses keys
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
     taskDistribution["All"] = totalTasks; //add total count to task distribution
     //Ensure all priority levels are included
     const taskPriorities = ["Low", "Medium", "High"];
     const taskPriorityLevelsRaw = await Task.aggregate([
       {
         $match: { assignedTo: userId },
       },
       {
         $group: {
           _id: "$priority",
           count: { $sum: 1 },
         },
       },
     ]);
     const taskPriorityLevels = taskStatuses.reduce((acc, priority) => {
       acc[priority] =
         taskPriorityLevelsRaw.find((item) => item._id === priority)?.count ||
         0;
       return acc;
     }, {});

     //fetch recent 10 tasks
     const recentTasks = await Task.find()
       .sort({ createdAt: -1 })
       .limit(10)
       .select("title status priority dueDate createdAt");

     res.status(200).json({
       statistics: {
         totalTasks,
         pendingTasks,
         completedTasks,
         overdueTasks,
       },
       charts: {
         taskDistribution,
         taskPriorityLevels,
       },
       recentTasks,
     });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getTasks = async (res, req) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profiileImageUrl"
      );
    } else {
      tasks = await Task.find(
        { ...filter, assignedTo: req.user._id }.populate(
          "assignedTo",
          "name email profiileImageUrl"
        )
      );
    }
    // add completed todo checklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckList.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    //status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
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
      completedTasks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getTaskById = async (res, req) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) {
      return res.status((404).json({ message: " Task not found" }));
    }
    res.json(task);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const createTask = async (res, req) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoCheckList,
    } = req.body;
    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assigned must be an array of user IDs" });
      async;
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoCheckList,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Task created Successfully", task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateTask = async (res, req) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status((404).json({ message: " Task not found" }));
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an arrya of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const deleteTask = async (res, req) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status((404).json({ message: " Task not found" }));
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateTaskStatus = async (res, req) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status((404).json({ message: " Task not found" }));
    }
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: " Not Authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "completed") {
      task.todoCheckList.forEach((item) => (item.completed = true));
      task.progress = 100;
    }
    await task.save();

    res.json({ message: "Task status updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateTaskChecklist = async (res, req) => {
  try {
    const {todoCheckList} = req.body;
    const task = await Task.findById(req.params.id);

    if(!task) return res.status(404).json({message: "Task not found "});

    if(!task.assignedTo.includes(req.user._id)&& req.user.role !== "admin"){
      return res.status(403).json({message:"Not Authorized to update checklist"});
    }

    task.todoCheckList = todoCheckList; // replace with updated checklist 

    // auto - update progress based on checklist completion
    const completedCount = task.todoCheckList.filter((item) => item.completed).length;
    const totalItems = task.todoCheckList.length;
    task.progress = totalItems > 0 ? Math.round((completedCount/totalItems)* 100) : 0;

    //auto - mark task as completed if all items are checked 
    if(task.progress === 100){
      task.status = "completed";
    } else if(task.progress > 0){
      task.status = "In Progress";
    } else {
      task.status = " Pending";
    }

     await task.save();
     const updatedTask = await task.findById(req.params.id).populate("assignedTo","name email profileImageUrl");

     res.json({message: "Task checklist updated", task:updatedTask});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export {
  getUserDashboardData,
  getDashboardData,
  getTaskById,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
};
