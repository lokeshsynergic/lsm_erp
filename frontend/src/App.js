import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import HrmsRoutes from "./routes/HrmsRoutes";
import CrmRoutes from "./routes/CrmRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/hrms/*" element={<HrmsRoutes />} />
        <Route path="/crm/*" element={<CrmRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
