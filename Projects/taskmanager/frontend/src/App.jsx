import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import CreateTask from "./pages/Admin/CreateTasks";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import MyTasks from "./pages/User/MyTasks";
import UserDashboard from "./pages/User/UserDashboard";
import VIewTaskDetails from "./pages/User/VIewTaskDetails";
import Privateroute from "./routes/Privateroute";
function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route element={<Privateroute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/manage-tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
            </Route>

            {/* User Routes */}
            <Route element={<Privateroute allowedRoles={["User"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/admin/users" element={<MyTasks />} />
              <Route path="/admin/manage-tasks" element={<VIewTaskDetails />} />
            </Route>
          </Routes>
        </Router>
      </div>
      <div>hii there</div>
    </>
  );
}

export default App;
