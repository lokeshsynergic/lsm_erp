import { Routes, Route } from "react-router-dom";
import CallLog from "../pages/crm/CallLog";
import AddCallLog from "../pages/crm/AddCallLog";
import CustomerList from "../pages/crm/customer/CustomerList";
import CustomerAdd from "../pages/crm/customer/CustomerAdd";
import VisitLog from "../pages/crm/activity/VisitLog";

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
      <Route path="/activity/visit-log" element={<VisitLog />} />
      <Route path="/activity/visit-log/add" element={<VisitLog />} />
      <Route path="/activity/visit-log/edit/:id" element={<VisitLog />} />
    </Routes>
  );
}

export default CrmRoutes;
