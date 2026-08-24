import { Routes, Route } from "react-router-dom";
import Userslist from "../pages/users/Userslist";
import AddUser from "../pages/users/AddUser";
import UserApprovals from "../pages/users/UserApprovals";


function UsersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Userslist />} />
      <Route path="/list" element={<Userslist />} />
      <Route path="/new" element={<AddUser />} />
      <Route path="/edit/:id" element={<AddUser />} />
      <Route path="/approvals" element={<UserApprovals />} />
    </Routes>
  );
}

export default UsersRoutes;
