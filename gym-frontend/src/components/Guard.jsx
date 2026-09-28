import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Guard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminGuard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase();

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// export function Guard() {
//   return useAuth().user ? <Outlet /> : <Navigate to="/login" replace />;
// }
// export function AdminGuard() {
//   const { user } = useAuth();
//   return user?.role === "ADMIN" ? (
//     <Outlet />
//   ) : (
//     <Navigate to={user ? "/dashboard" : "/login"} replace />
//   );
// }
