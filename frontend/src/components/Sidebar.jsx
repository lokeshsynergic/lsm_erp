import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";
import {
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  IdCard,
  Package,
  Tags,
  UserRound,
  Users,Ruler,
  Factory,
  FolderTree,
  Layers,
} from "lucide-react";

const menuItems = [
  { label: "Accounting", icon: <IdCard size={18} />, expandable: true, hidden: true },
  { label: "Buying", icon: <Package size={18} />, hidden: true },
  { label: "Selling", icon: <FileText size={18} />, hidden: true },
  { label: "Stock", icon: <Boxes size={18} />, hidden: true },
  { label: "Assets", icon: <Building2 size={18} />, hidden: true },
  {
    label: "HRMS",
    icon: <BriefcaseBusiness size={18} strokeWidth={1.8} color="currentColor" />,
    expandable: true,
    submenu: [
      {
        label: "Master",
        icon: <GraduationCap size={18} strokeWidth={1.8} color="currentColor" />,
        expandable: true,
        submenu: [
          { label: "Department", icon: <Building2 size={16} />, to: "/hrms/department" },
          { label: "Designation", icon: <BadgeCheck size={16} />, to: "/hrms/designation" },
          { label: "Category", icon: <Tags size={16} />, to: "/hrms/category" },
          { label: "Document", icon: <FileText size={16} />, to: "/hrms/document" },
           { label: "Branch", icon: <Building2 size={16} />, to: "/hrms/branch" },
          { label: "Shift", icon: <Clock3 size={16} />, to: "/hrms/shift" },
          { label: "Employee", icon: <UserRound size={16} />, to: "/hrms/employee" },
        ],
      }
      ,
      { label: "Attendance", icon: <Clock3 size={16} />, to: "/hrms/attendance-dashboard" },
    ],
  },
  { label: "Manufacturing", icon: <Building2 size={18} />, hidden: true },
  {
    label: "CRM",
    icon: <Users size={18} strokeWidth={1.8} color="currentColor" />,
    expandable: true,
    submenu: [
      { label: "Customer", icon: <Users size={16} />, to: "/crm/customer" },
      { label: "Call Log", icon: <FileText size={16} />, to: "/crm/call-log" },
      {
        label: "Activity",
        icon: <Clock3 size={16} />,
        expandable: true,
        submenu: [
          { label: "Visit Log", icon: <FileText size={16} />, to: "/crm/activity/visit-log" }
        ],
      }
    ],
  },
  {
    label: "Users",
    icon: <Users size={18} strokeWidth={1.8} color="currentColor" />,
    expandable: true,
    submenu: [
      { label: "User List", icon: <UserRound size={16} />, to: "/users/list" },
      { label: "Approvals", icon: <BadgeCheck size={16} />, to: "/users/approvals" },
    ],
  },
  {
    label: "INVENTORY",
    icon: <Boxes size={18} strokeWidth={1.8} color="currentColor" />,
    expandable: true,
    submenu: [
      {
        label: "Master",
        icon: <Building2 size={18} strokeWidth={1.8} color="currentColor" />,
        expandable: true,
        submenu: [
          { label: "Category", icon: <FolderTree size={16} />, to: "/inventory/category" },
          { label: "Subcategory", icon: <Layers size={16} />, to: "/inventory/subcategory" },
          { label: "Manufacturer", icon: <Factory size={16} />, to: "/inventory/manufacturer" },
          { label: "Unit", icon: <Ruler size={16} />, to: "/inventory/unit" },
        ],
      },
      { label: "Products", icon: <Package size={16} />, to: "/inventory/products" }
    ],
  },
];

function Sidebar() {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState("HRMS");
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState("HRMS-Master");

  useEffect(() => {
    if (location.pathname.startsWith("/inventory")) {
      setOpenSubmenu("INVENTORY");
      setOpenNestedSubmenu("INVENTORY-Master");
      return;
    }

    if (location.pathname.startsWith("/hrms")) {
      setOpenSubmenu("HRMS");
      setOpenNestedSubmenu("HRMS-Master");
      return;
    }

    if (location.pathname.startsWith("/crm")) {
      setOpenSubmenu("CRM");
      if (location.pathname.startsWith("/crm/activity")) {
        setOpenNestedSubmenu("CRM-Activity");
      } else {
        setOpenNestedSubmenu("");
      }
      return;
    }

    if (location.pathname.startsWith("/users")) {
      setOpenSubmenu("Users");
      setOpenNestedSubmenu("");
    }
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      <ul>
        {menuItems
          .filter((item) => !item.hidden)
          .map((item) => {
            if (item.submenu) {
              const isOpen = openSubmenu === item.label;
              return (
                <li key={item.label} className="has-submenu layer-1">
                  <button
                    type="button"
                    className="sidebar-link"
                    onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className={`expand-caret ${isOpen ? "open" : ""}`}>
                      <ChevronDown size={18} color="currentColor" />
                    </span>
                  </button>

                  {isOpen && (
                    <ul className="submenu layer-2-menu">
                      {item.submenu.map((sub) => {
                        if (sub.submenu) {
                          const nestedKey = `${item.label}-${sub.label}`;
                          const isNestedOpen = openNestedSubmenu === nestedKey;
                          return (
                            <li key={sub.label} className="has-submenu layer-2">
                              <button
                                type="button"
                                className="sidebar-link"
                                onClick={() => setOpenNestedSubmenu(isNestedOpen ? "" : nestedKey)}
                              >
                                <span className="menu-icon">{sub.icon}</span>
                                <span>{sub.label}</span>
                                <span className={`expand-caret ${isNestedOpen ? "open" : ""}`}>
                                  <ChevronDown size={18} color="currentColor" />
                                </span>
                              </button>

                              {isNestedOpen && (
                                <ul className="submenu nested-submenu layer-3-menu">
                                  {sub.submenu.map((nested) => (
                                    <li key={nested.label} className="layer-3">
                                      <NavLink to={nested.to} className="sidebar-link">
                                        <span className="menu-icon">{nested.icon}</span>
                                        {nested.label}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        }

                        return (
                          <li key={sub.label} className="layer-2">
                            <NavLink to={sub.to} className="sidebar-link">
                              <span className="menu-icon">{sub.icon}</span>
                              {sub.label}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label} className="layer-1">
                {item.to ? (
                  <NavLink to={item.to} className="sidebar-link">
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ) : (
                  <div className="sidebar-link">
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                )}
              </li>
            );
          })}
      </ul>
    </aside>
  );
}

export default Sidebar;
