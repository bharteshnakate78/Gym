import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Dumbbell,
  GalleryHorizontal,
  Home,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  X,
  ClipboardList,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState({
    name: "Administrator",
    email: "",
    role: "ADMIN",
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser({
          name:
            parsedUser.name ||
            parsedUser.fullName ||
            parsedUser.username ||
            "Administrator",
          email: parsedUser.email || "",
          role: parsedUser.role || "ADMIN",
        });
      }
    } catch (error) {
      console.error("Unable to load admin user:", error);
    }
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: BarChart3,
    },

    {
      label: "Programs",
      path: "/admin/programs",
      icon: ClipboardList,
    },
    {
      label: "Trainers",
      path: "/admin/trainers",
      icon: Dumbbell,
    },

    {
      label: "Memberships",
      path: "/admin/memberships",
      icon: ShieldCheck,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: CreditCard,
      highlight: true,
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const getInitials = () => {
    const name = user.name || "Admin";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="admin-mobile-header">
        <button
          type="button"
          className="admin-mobile-menu-button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open admin menu"
        >
          <Menu size={23} />
        </button>

        <div className="admin-mobile-brand">
          <div className="admin-brand-mark">G</div>

          <div>
            <div className="admin-brand-title">GYM</div>
            <div className="admin-brand-subtitle">ADMIN PANEL</div>
          </div>
        </div>

        <button
          type="button"
          className="admin-mobile-notification"
          onClick={() => navigate("/admin/dashboard")}
          aria-label="Dashboard"
        >
          <Bell size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="admin-sidebar-overlay" onClick={closeMobile} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${
          collapsed ? "admin-sidebar-collapsed" : ""
        } ${mobileOpen ? "admin-sidebar-mobile-open" : ""}`}
      >
        {/* BRAND */}
        <div className="admin-sidebar-brand">
          <div className="admin-brand-logo">G</div>

          {!collapsed && (
            <div className="admin-brand-text">
              <div className="admin-brand-name">GYM</div>
              <div className="admin-brand-caption">ADMIN PANEL</div>
            </div>
          )}

          <button
            type="button"
            className="admin-mobile-close"
            onClick={closeMobile}
            aria-label="Close admin menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          type="button"
          className="admin-collapse-button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>

        {/* ADMIN PROFILE */}
        <div className="admin-profile-card">
          <div className="admin-avatar">{getInitials()}</div>

          {!collapsed && (
            <div className="admin-profile-info">
              <div className="admin-profile-name">{user.name}</div>

              <div className="admin-profile-role">
                <span className="admin-status-dot" />
                Administrator
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-heading">{!collapsed && "MAIN MENU"}</div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? "admin-nav-item-active" : ""} ${
                    item.highlight ? "admin-nav-item-payment" : ""
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="admin-nav-icon">
                  <Icon size={19} strokeWidth={1.9} />
                </span>

                {!collapsed && (
                  <span className="admin-nav-label">{item.label}</span>
                )}

                {!collapsed && item.highlight && (
                  <span className="admin-payment-badge">NEW</span>
                )}
              </NavLink>
            );
          })}

          <div className="admin-nav-divider" />

          <div className="admin-nav-heading">
            {!collapsed && "QUICK ACCESS"}
          </div>

          <NavLink
            to="/"
            onClick={closeMobile}
            className="admin-nav-item"
            title={collapsed ? "View Website" : undefined}
          >
            <span className="admin-nav-icon">
              <Home size={19} strokeWidth={1.9} />
            </span>

            {!collapsed && (
              <span className="admin-nav-label">View Website</span>
            )}
          </NavLink>

          <NavLink
            to="/admin/dashboard"
            onClick={closeMobile}
            className="admin-nav-item"
            title={collapsed ? "Notifications" : undefined}
          >
            <span className="admin-nav-icon">
              <Bell size={19} strokeWidth={1.9} />
            </span>

            {!collapsed && (
              <>
                <span className="admin-nav-label">Notifications</span>

                <span className="admin-notification-badge">3</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            className="admin-nav-item admin-nav-button"
            onClick={() => alert("Settings page can be added here.")}
            title={collapsed ? "Settings" : undefined}
          >
            <span className="admin-nav-icon">
              <Settings size={19} strokeWidth={1.9} />
            </span>

            {!collapsed && <span className="admin-nav-label">Settings</span>}
          </button>
        </nav>

        {/* SECURITY CARD */}
        {!collapsed && (
          <div className="admin-security-card">
            <div className="admin-security-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <div className="admin-security-title">System Secure</div>

              <div className="admin-security-text">Admin access protected</div>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-logout-button"
            onClick={logout}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={19} />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* SIDEBAR CSS */}
      <style>{`
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 270px;
          z-index: 1200;

          display: flex;
          flex-direction: column;

          background:
            radial-gradient(
              circle at top left,
              rgba(212, 175, 55, 0.10),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #111111 0%,
              #0b0b0b 100%
            );

          border-right: 1px solid
            rgba(212, 175, 55, 0.16);

          box-shadow:
            15px 0 50px rgba(0, 0, 0, 0.35);

          transition:
            width 0.28s ease,
            transform 0.28s ease;
        }

        .admin-sidebar-collapsed {
          width: 84px;
        }

        .admin-sidebar-brand {
          height: 82px;
          padding: 0 22px;

          display: flex;
          align-items: center;
          gap: 13px;

          border-bottom: 1px solid
            rgba(255, 255, 255, 0.06);
        }

        .admin-brand-logo,
        .admin-brand-mark {
          width: 42px;
          height: 42px;
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          color: #111;
          font-size: 19px;
          font-weight: 950;

          background:
            linear-gradient(
              135deg,
              #f1d879,
              #d4af37
            );

          box-shadow:
            0 7px 25px
              rgba(212, 175, 55, 0.20);
        }

        .admin-brand-text {
          min-width: 0;
        }

        .admin-brand-name {
          color: #fff;
          font-size: 1.1rem;
          line-height: 1;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .admin-brand-caption {
          margin-top: 5px;
          color: #d4af37;
          font-size: 0.61rem;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .admin-collapse-button {
          position: absolute;
          top: 72px;
          right: -13px;

          width: 27px;
          height: 27px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid
            rgba(212, 175, 55, 0.35);

          border-radius: 50%;

          background: #151515;
          color: #d4af37;

          cursor: pointer;

          box-shadow:
            0 5px 18px rgba(0, 0, 0, 0.45);

          transition: all 0.2s ease;
        }

        .admin-collapse-button:hover {
          background: #d4af37;
          color: #111;
          transform: scale(1.08);
        }

        .admin-mobile-close {
          display: none;
          margin-left: auto;

          width: 36px;
          height: 36px;

          border: 0;
          border-radius: 10px;

          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.8);

          cursor: pointer;
        }

        .admin-profile-card {
          margin: 22px 15px 14px;
          padding: 12px;

          display: flex;
          align-items: center;
          gap: 11px;

          border-radius: 15px;

          background: rgba(255, 255, 255, 0.035);
          border: 1px solid
            rgba(255, 255, 255, 0.055);
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          color: #111;
          background:
            linear-gradient(
              135deg,
              #f2dc86,
              #c89f2d
            );

          font-size: 0.85rem;
          font-weight: 950;
        }

        .admin-profile-info {
          min-width: 0;
          overflow: hidden;
        }

        .admin-profile-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          color: #fff;
          font-size: 0.84rem;
          font-weight: 850;
        }

        .admin-profile-role {
          margin-top: 4px;

          display: flex;
          align-items: center;
          gap: 5px;

          color: rgba(255, 255, 255, 0.45);
          font-size: 0.68rem;
        }

        .admin-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 7px #4ade80;
        }

        .admin-sidebar-nav {
          flex: 1;
          overflow-y: auto;

          padding: 4px 12px 15px;

          scrollbar-width: thin;
          scrollbar-color:
            rgba(212, 175, 55, 0.3)
            transparent;
        }

        .admin-nav-heading {
          padding: 13px 12px 8px;

          color: rgba(255, 255, 255, 0.30);
          font-size: 0.61rem;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .admin-nav-item {
          position: relative;

          width: 100%;
          min-height: 46px;

          margin: 3px 0;

          padding: 0 12px;

          display: flex;
          align-items: center;
          gap: 12px;

          border: 1px solid transparent;
          border-radius: 12px;

          color: rgba(255, 255, 255, 0.60);
          background: transparent;

          text-decoration: none;

          font-family: inherit;
          font-size: 0.84rem;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .admin-nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.055);
          border-color: rgba(255, 255, 255, 0.055);
        }

        .admin-nav-item-active {
          color: #d4af37 !important;

          background:
            linear-gradient(
              90deg,
              rgba(212, 175, 55, 0.15),
              rgba(212, 175, 55, 0.045)
            ) !important;

          border-color:
            rgba(212, 175, 55, 0.18) !important;

          box-shadow:
            inset 3px 0 0 #d4af37;
        }

        .admin-nav-item-payment {
          margin-top: 6px;
        }

        .admin-nav-item-payment:not(
            .admin-nav-item-active
          ) {
          color: rgba(212, 175, 55, 0.80);
        }

        .admin-nav-icon {
          width: 23px;
          height: 23px;
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-nav-label {
          flex: 1;
          text-align: left;
          white-space: nowrap;
        }

        .admin-payment-badge {
          padding: 3px 6px;

          border-radius: 5px;

          color: #111;
          background: #d4af37;

          font-size: 0.51rem;
          font-weight: 950;
          letter-spacing: 0.05em;
        }

        .admin-notification-badge {
          min-width: 19px;
          height: 19px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 6px;

          color: #111;
          background: #d4af37;

          font-size: 0.62rem;
          font-weight: 950;
        }

        .admin-nav-button {
          font-family: inherit;
        }

        .admin-nav-divider {
          height: 1px;
          margin: 14px 8px 5px;

          background: rgba(255, 255, 255, 0.06);
        }

        .admin-security-card {
          margin: 8px 15px 15px;
          padding: 13px;

          display: flex;
          align-items: center;
          gap: 11px;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              rgba(212, 175, 55, 0.09),
              rgba(255, 255, 255, 0.025)
            );

          border: 1px solid
            rgba(212, 175, 55, 0.15);
        }

        .admin-security-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          color: #d4af37;
          background: rgba(212, 175, 55, 0.10);
        }

        .admin-security-title {
          color: #fff;
          font-size: 0.72rem;
          font-weight: 850;
        }

        .admin-security-text {
          margin-top: 3px;
          color: rgba(255, 255, 255, 0.38);
          font-size: 0.61rem;
        }

        .admin-sidebar-footer {
          padding: 14px 15px 18px;

          border-top: 1px solid
            rgba(255, 255, 255, 0.055);
        }

        .admin-logout-button {
          width: 100%;
          min-height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          border: 1px solid
            rgba(255, 255, 255, 0.07);

          border-radius: 11px;

          color: rgba(255, 255, 255, 0.58);
          background: rgba(255, 255, 255, 0.025);

          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 750;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .admin-logout-button:hover {
          color: #ff6b6b;
          border-color:
            rgba(255, 107, 107, 0.20);
          background:
            rgba(255, 107, 107, 0.06);
        }

        /* COLLAPSED */

        .admin-sidebar-collapsed
          .admin-sidebar-brand {
          padding: 0;
          justify-content: center;
        }

        .admin-sidebar-collapsed
          .admin-profile-card {
          justify-content: center;
          margin-left: 10px;
          margin-right: 10px;
        }

        .admin-sidebar-collapsed
          .admin-nav-item {
          justify-content: center;
          padding-left: 0;
          padding-right: 0;
        }

        .admin-sidebar-collapsed
          .admin-sidebar-footer {
          padding-left: 10px;
          padding-right: 10px;
        }

        /* MOBILE */

        .admin-mobile-header {
          display: none;
        }

        .admin-sidebar-overlay {
          display: none;
        }

        @media (max-width: 900px) {
          .admin-mobile-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1100;

            height: 64px;
            padding: 0 16px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            background: rgba(10, 10, 10, 0.96);
            backdrop-filter: blur(18px);

            border-bottom: 1px solid
              rgba(212, 175, 55, 0.14);
          }

          .admin-mobile-menu-button,
          .admin-mobile-notification {
            width: 40px;
            height: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 1px solid
              rgba(255, 255, 255, 0.08);

            border-radius: 11px;

            color: rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.04);

            cursor: pointer;
          }

          .admin-mobile-brand {
            display: flex;
            align-items: center;
            gap: 9px;
          }

          .admin-brand-mark {
            width: 35px;
            height: 35px;
            border-radius: 10px;
            font-size: 16px;
          }

          .admin-brand-title {
            color: #fff;
            font-size: 0.88rem;
            font-weight: 950;
            letter-spacing: 0.08em;
          }

          .admin-brand-subtitle {
            margin-top: 2px;
            color: #d4af37;
            font-size: 0.49rem;
            font-weight: 850;
            letter-spacing: 0.13em;
          }

          .admin-sidebar {
            width: 275px;
            transform: translateX(-105%);
            transition: transform 0.28s ease;
          }

          .admin-sidebar-collapsed {
            width: 275px;
          }

          .admin-sidebar-mobile-open {
            transform: translateX(0);
          }

          .admin-sidebar-overlay {
            position: fixed;
            inset: 0;
            z-index: 1150;

            display: block;

            background: rgba(0, 0, 0, 0.68);
            backdrop-filter: blur(3px);
          }

          .admin-collapse-button {
            display: none;
          }

          .admin-mobile-close {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .admin-sidebar-collapsed
            .admin-sidebar-brand {
            padding: 0 22px;
            justify-content: flex-start;
          }

          .admin-sidebar-collapsed
            .admin-profile-card {
            justify-content: flex-start;
            margin-left: 15px;
            margin-right: 15px;
          }

          .admin-sidebar-collapsed
            .admin-nav-item {
            justify-content: flex-start;
            padding-left: 12px;
            padding-right: 12px;
          }

          .admin-sidebar-collapsed
            .admin-sidebar-footer {
            padding-left: 15px;
            padding-right: 15px;
          }
        }

        @media (min-width: 901px) {
          .admin-mobile-close {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
