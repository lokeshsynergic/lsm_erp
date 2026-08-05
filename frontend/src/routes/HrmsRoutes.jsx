import { Routes, Route } from "react-router-dom";
import EmployeeList from "../pages/hrms/EmployeeList";
import EmployeeAdd from "../pages/hrms/EmployeeAdd";
import Department from "../pages/hrms/Department";
import Designation from "../pages/hrms/Designation";
import Category from "../pages/hrms/Category";
import AddDepartment from "../pages/hrms/AddDepartment";
import AddDesignation from "../pages/hrms/AddDesignation";
import AddCategory from "../pages/hrms/AddCategory";

function HrmsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EmployeeList />} />
      <Route path="/employee/new" element={<EmployeeAdd />} />
      <Route path="/department" element={<Department />} />
      <Route path="/department/new" element={<AddDepartment />} />
      <Route path="/department/edit/:id" element={<AddDepartment />} />
      <Route path="/designation" element={<Designation />} />
      <Route path="/designation/new" element={<AddDesignation />} />
      <Route path="/designation/edit/:id" element={<AddDesignation />} />
      <Route path="/category" element={<Category />} />
      <Route path="/category/new" element={<AddCategory />} />
      <Route path="/category/edit/:id" element={<AddCategory />} />
    </Routes>
  );
}

export default HrmsRoutes;
