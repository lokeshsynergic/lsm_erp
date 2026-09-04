import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <>
      <Header />

      <div className="layout">
        <Sidebar />
        <div className="content">
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;