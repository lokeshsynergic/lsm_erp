import { Routes, Route } from "react-router-dom";
import CallLog from "../pages/crm/CallLog";
import AddCallLog from "../pages/crm/AddCallLog";

function CrmRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CallLog />} />
      <Route path="/call-log" element={<CallLog />} />
      <Route path="/call-log/add" element={<AddCallLog />} />
      <Route path="/call-log/edit/:id" element={<AddCallLog />} />
    </Routes>
  );
}

export default CrmRoutes;
