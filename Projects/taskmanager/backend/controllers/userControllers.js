import { User } from "../models/User.js";
import { Task } from "../models/Task.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: users._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: users._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: users._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );
    res.json(userWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export { getUserById, getUsers, deleteUser };
