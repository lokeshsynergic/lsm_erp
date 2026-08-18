import { Routes, Route } from "react-router-dom";
import Users from "../pages/users/Users";
import UserApprovals from "../pages/users/UserApprovals";

function UsersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="/list" element={<Users />} />
      <Route path="/approvals" element={<UserApprovals />} />
    </Routes>
  );
}

export default UsersRoutes;
