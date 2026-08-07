import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { label: "Accounting", icon: "🧮", expandable: true, hidden: true },
  { label: "Buying", icon: "🛍️", hidden: true },
  { label: "Selling", icon: "🗂️", hidden: true },
  { label: "Stock", icon: "📦", hidden: true },
  { label: "Assets", icon: "🗄️", hidden: true },
  {
    label: "HRMS",
    icon: "🪪",
    expandable: true,
    submenu: [
      {
        label: "Master",
        expandable: true,
        submenu: [
          { label: "Department", to: "/hrms/department" },
          { label: "Designation", to: "/hrms/designation" },
          { label: "Category", to: "/hrms/category" },
          { label: "Document", to: "/hrms/document" },
          { label: "Shift", to: "/hrms/shift" },
          { label: "Employee", to: "/hrms/employee" },
        ],
      },
    ],
  },
  { label: "Manufacturing", icon: "🏭", hidden: true },
  {
    label: "CRM",
    icon: "🥧",
    expandable: true,
    submenu: [
      { label: "Call Log", to: "/crm/call-log" },
    ],
  },
  { label: "Quality", icon: "🎯", hidden: true },
  { label: "Projects", icon: "📁", hidden: true },
  { label: "Support", icon: "🎧", hidden: true },
];

function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState("HRMS");
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState("Master");

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
                  {/* LEVEL 1: HRMS, CRM */}
                  <button
                    type="button"
                    className="sidebar-link"
                    onClick={() =>
                      setOpenSubmenu(isOpen ? null : item.label)
                    }
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className={`expand-caret ${isOpen ? "open" : ""}`}>
                      ⌄
                    </span>
                  </button>

                  {isOpen && (
                    <ul className="submenu layer-2-menu">
                      {item.submenu.map((sub) => {
                        if (sub.submenu) {
                          const isNestedOpen = openNestedSubmenu === sub.label;
                          return (
                            <li key={sub.label} className="has-submenu layer-2">
                              {/* LEVEL 2: Master */}
                              <button
                                type="button"
                                className="sidebar-sublink master-btn"
                                onClick={() =>
                                  setOpenNestedSubmenu(
                                    isNestedOpen ? null : sub.label
                                  )
                                }
                              >
                                <span>{sub.label}</span>
                                <span
                                  className={`expand-caret ${
                                    isNestedOpen ? "open" : ""
                                  }`}
                                >
                                  ⌄
                                </span>
                              </button>

                              {isNestedOpen && (
                                <ul className="submenu nested-submenu layer-3-menu">
                                  {sub.submenu.map((nested) => (
                                    <li key={nested.label} className="layer-3">
                                      {/* LEVEL 3: Department, Employee */}
                                      <NavLink
                                        to={nested.to}
                                        className="sidebar-sublink"
                                      >
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
                            <NavLink to={sub.to} className="sidebar-sublink">
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