import { Routes, Route } from "react-router-dom";
import CallLog from "../pages/crm/CallLog";
import AddCallLog from "../pages/crm/AddCallLog";
import CustomerList from "../pages/crm/customer/CustomerList";
import CustomerAdd from "../pages/crm/customer/CustomerAdd";

function CrmRoutes() {
  return (
    <Routes>
      <Route path="/customer" element={<CustomerList />} />
      <Route path="/customer/new" element={<CustomerAdd />} />
      <Route path="/customer/edit/:id" element={<CustomerAdd />} />
      <Route path="/" element={<CallLog />} />
      <Route path="/call-log" element={<CallLog />} />
      <Route path="/call-log/add" element={<AddCallLog />} />
      <Route path="/call-log/edit/:id" element={<AddCallLog />} />
    </Routes>
  );
}

export default CrmRoutes;
