import { Routes, Route } from "react-router-dom";
import EmployeeList from "../pages/hrms/EmployeeList";
import EmployeeAdd from "../pages/hrms/EmployeeAdd";
import Department from "../pages/hrms/Department";
import Designation from "../pages/hrms/Designation";
import Category from "../pages/hrms/Category";
import AddDepartment from "../pages/hrms/AddDepartment";
import AddDesignation from "../pages/hrms/AddDesignation";
import AddCategory from "../pages/hrms/AddCategory";
import Document from "../pages/hrms/Document";
import AddDocument from "../pages/hrms/AddDocument";
import Shift from "../pages/hrms/master/ListShift";
import AddShift from "../pages/hrms/master/AddShift";

function HrmsRoutes() {
  return (
    <Routes>
      <Route path="/employee" element={<EmployeeList />} />
      <Route path="/employee/new" element={<EmployeeAdd />} />
      <Route path="/employee/edit/:id" element={<EmployeeAdd />} />
      <Route path="/department" element={<Department />} />
      <Route path="/department/new" element={<AddDepartment />} />
      <Route path="/department/edit/:id" element={<AddDepartment />} />
      <Route path="/designation" element={<Designation />} />
      <Route path="/designation/new" element={<AddDesignation />} />
      <Route path="/designation/edit/:id" element={<AddDesignation />} />
      <Route path="/category" element={<Category />} />
      <Route path="/category/new" element={<AddCategory />} />
      <Route path="/category/edit/:id" element={<AddCategory />} />
      <Route path="/document" element={<Document />} />
      <Route path="/document/new" element={<AddDocument />} />
      <Route path="/document/edit/:id" element={<AddDocument />} />
      <Route path="/shift" element={<Shift />} />
      <Route path="/shift/new" element={<AddShift />} />
      <Route path="/shift/edit/:id" element={<AddShift />} />
      

    </Routes>
  );
}

export default HrmsRoutes;
