import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HrmsRoutes from "./routes/HrmsRoutes";
import CrmRoutes from "./routes/CrmRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/hrms/*" element={<HrmsRoutes />} />
        <Route path="/crm/*" element={<CrmRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
