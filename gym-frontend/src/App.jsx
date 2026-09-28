import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

// =========================================================
// COMMON COMPONENTS
// =========================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// =========================================================
// PUBLIC PAGES
// =========================================================

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Programs from "./pages/Programs";
import Gallery from "./pages/Gallery";
import Memberships from "./pages/Memberships";
import Trainers from "./pages/Trainers";

// =========================================================
// USER PAGES
// =========================================================

import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";

// =========================================================
// ADMIN PAGES
// =========================================================

import AdminDashboard from "./pages/admin/Admin";
import ManagePrograms from "./pages/admin/ManagePrograms";
import ManageTrainers from "./pages/admin/ManageTrainers";
import ManageMemberships from "./pages/admin/ManageMemberships";
import Payments from "./pages/admin/Payments";

// =========================================================
// ADMIN SIDEBAR
// =========================================================

import AdminSidebar from "./pages/admin/AdminSidebar";

// =========================================================
// STORED USER HELPERS
// =========================================================

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read stored user:", error);
    return null;
  }
};

const getToken = () => {
  return localStorage.getItem("token");
};

// =========================================================
// USER PROTECTED ROUTE
// =========================================================

function ProtectedRoute() {
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// =========================================================
// ADMIN PROTECTED ROUTE
// =========================================================

function AdminGuard() {
  const token = getToken();
  const user = getStoredUser();

  // -------------------------------------------------------
  // NOT LOGGED IN
  // -------------------------------------------------------

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // -------------------------------------------------------
  // NORMALIZE ROLE
  // -------------------------------------------------------

  const role = String(user.role || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase();

  // -------------------------------------------------------
  // ONLY ADMIN ALLOWED
  // -------------------------------------------------------

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// =========================================================
// ADMIN LAYOUT
// =========================================================

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}

// =========================================================
// 404 PAGE
// =========================================================

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-code">404</div>

        <h1>Page Not Found</h1>

        <p>
          The page you are looking for does not exist or may have been moved.
        </p>

        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

// =========================================================
// MAIN APP
// =========================================================

function App() {
  return (
    <>
      <style>{`
        /* =====================================================
           GLOBAL
        ===================================================== */

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          min-height: 100%;
          width: 100%;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background: #070707;
          color: #ffffff;
        }

        button,
        input,
        select,
        textarea {
          font-family: inherit;
        }

        a {
          color: inherit;
        }

        /* =====================================================
           ADMIN LAYOUT
        ===================================================== */

        .admin-layout {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(212, 175, 55, 0.07),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(212, 175, 55, 0.04),
              transparent 28%
            ),
            #070707;
        }

        .admin-main-content {
          min-height: 100vh;

          margin-left: 270px;

          width: calc(100% - 270px);

          position: relative;

          transition:
            margin-left 0.28s ease,
            width 0.28s ease;
        }

        /* =====================================================
           404 PAGE
        ===================================================== */

        .not-found-page {
          min-height: 100vh;

          display: flex;

          align-items: center;

          justify-content: center;

          text-align: center;

          padding: 30px;

          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(212, 175, 55, 0.08),
              transparent 35%
            ),
            #070707;

          color: #ffffff;
        }

        .not-found-card {
          max-width: 600px;

          width: 100%;
        }

        .not-found-code {
          font-size: 100px;

          font-weight: 900;

          line-height: 1;

          letter-spacing: -5px;

          color: #d4af37;

          text-shadow:
            0 0 30px rgba(212, 175, 55, 0.18);
        }

        .not-found-card h1 {
          margin: 25px 0 12px;

          font-size: 34px;

          font-weight: 800;
        }

        .not-found-card p {
          margin: 0 auto 28px;

          max-width: 500px;

          color: #999;

          font-size: 16px;

          line-height: 1.7;
        }

        .not-found-card a {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding: 13px 24px;

          border-radius: 10px;

          background: #d4af37;

          color: #080808;

          text-decoration: none;

          font-weight: 800;

          transition: 0.25s ease;
        }

        .not-found-card a:hover {
          transform: translateY(-2px);

          box-shadow:
            0 10px 30px
            rgba(212, 175, 55, 0.2);
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {
          .admin-main-content {
            margin-left: 0;

            width: 100%;

            padding-top: 64px;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {
          .admin-main-content {
            padding-bottom: 70px;
          }

          .not-found-code {
            font-size: 75px;
          }

          .not-found-card h1 {
            font-size: 27px;
          }

          .not-found-card p {
            font-size: 14px;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          APPLICATION ROUTES
      ===================================================== */}

      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route path="/" element={<Home />} />

        {/* ABOUT PAGE */}

        <Route path="/about" element={<About />} />

        {/* CONTACT PAGE */}

        <Route path="/contact" element={<Contact />} />

        {/* LOGIN */}

        <Route path="/login" element={<Login />} />

        {/* REGISTER */}

        <Route path="/register" element={<Register />} />

        {/* PROGRAMS */}

        <Route path="/programs" element={<Programs />} />

        {/* GALLERY */}

        <Route path="/gallery" element={<Gallery />} />

        {/* MEMBERSHIPS */}

        <Route path="/memberships" element={<Memberships />} />

        {/* TRAINERS */}

        <Route path="/trainers" element={<Trainers />} />

        {/* =====================================================
            USER PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>
          {/* USER DASHBOARD */}

          <Route path="/dashboard" element={<Dashboard />} />

          {/* PAYMENT */}

          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* =====================================================
            ADMIN PROTECTED ROUTES
        ===================================================== */}

        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            {/* =================================================
                ADMIN ROOT
            ================================================= */}

            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* =================================================
                MANAGE PROGRAMS
            ================================================= */}

            <Route path="/admin/programs" element={<ManagePrograms />} />

            {/* =================================================
                MANAGE TRAINERS
            ================================================= */}

            <Route path="/admin/trainers" element={<ManageTrainers />} />

            {/* =================================================
                MANAGE MEMBERSHIPS
            ================================================= */}

            <Route path="/admin/memberships" element={<ManageMemberships />} />

            {/* =================================================
                PAYMENT MANAGEMENT
            ================================================= */}

            <Route path="/admin/payments" element={<Payments />} />

            {/* =================================================
                PAYMENT ALIASES
            ================================================= */}

            <Route
              path="/admin/payment"
              element={<Navigate to="/admin/payments" replace />}
            />

            <Route
              path="/admin/payment-history"
              element={<Navigate to="/admin/payments" replace />}
            />
          </Route>
        </Route>

        {/* =====================================================
            HOME ALIAS
        ===================================================== */}

        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* =====================================================
            404
        ===================================================== */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </>
  );
}

export default App;

// import React from "react";
// import { Navigate, Outlet, Route, Routes } from "react-router-dom";

// // =========================================================
// // PUBLIC PAGES
// // =========================================================
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Programs from "./pages/Programs";
// import Gallery from "./pages/Gallery";
// import Memberships from "./pages/Memberships";
// import Trainers from "./pages/Trainers";

// // =========================================================
// // USER PAGES
// // =========================================================

// import Dashboard from "./pages/Dashboard";
// import Payment from "./pages/Payment";

// // =========================================================
// // ADMIN PAGES
// // =========================================================

// import AdminDashboard from "./pages/admin/Admin";
// import ManagePrograms from "./pages/admin/ManagePrograms";
// import ManageTrainers from "./pages/admin/ManageTrainers";
// import ManageMemberships from "./pages/admin/ManageMemberships";
// import Payments from "./pages/admin/Payments";

// // =========================================================
// // ADMIN SIDEBAR
// // =========================================================

// // IMPORTANT:
// // Use this path if your file is:
// // src/pages/admin/AdminSidebar.jsx
// import AdminSidebar from "./pages/admin/AdminSidebar";

// // =========================================================
// // STORED USER HELPERS
// // =========================================================

// const getStoredUser = () => {
//   try {
//     const storedUser = localStorage.getItem("user");

//     if (!storedUser) {
//       return null;
//     }

//     return JSON.parse(storedUser);
//   } catch (error) {
//     console.error("Unable to read stored user:", error);

//     return null;
//   }
// };

// const getToken = () => {
//   return localStorage.getItem("token");
// };

// // =========================================================
// // USER PROTECTED ROUTE
// // =========================================================

// function ProtectedRoute() {
//   const token = getToken();
//   const user = getStoredUser();

//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }

// // =========================================================
// // ADMIN PROTECTED ROUTE
// // =========================================================

// function AdminGuard() {
//   const token = getToken();
//   const user = getStoredUser();

//   // Not logged in
//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Normalize role
//   const role = String(user.role || "")
//     .replace(/^ROLE_/i, "")
//     .trim()
//     .toUpperCase();

//   // Only ADMIN allowed
//   if (role !== "ADMIN") {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// }

// // =========================================================
// // ADMIN LAYOUT
// // =========================================================

// function AdminLayout() {
//   return (
//     <div className="admin-layout">
//       <AdminSidebar />

//       <main className="admin-main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// // =========================================================
// // 404 PAGE
// // =========================================================

// function NotFound() {
//   return (
//     <div className="not-found-page">
//       <div className="not-found-card">
//         <div className="not-found-code">404</div>

//         <h1>Page Not Found</h1>

//         <p>The page you are looking for does not exist.</p>

//         <a href="/">Back to Home</a>
//       </div>
//     </div>
//   );
// }

// // =========================================================
// // MAIN APP
// // =========================================================

// function App() {
//   return (
//     <>
//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         html,
//         body,
//         #root {
//           margin: 0;
//           padding: 0;
//           min-height: 100%;
//           width: 100%;
//         }

//         body {
//           font-family:
//             Inter,
//             -apple-system,
//             BlinkMacSystemFont,
//             "Segoe UI",
//             sans-serif;

//           background: #070707;
//         }

//         button,
//         input,
//         select,
//         textarea {
//           font-family: inherit;
//         }

//         /* =====================================================
//            ADMIN LAYOUT
//         ===================================================== */

//         .admin-layout {
//           min-height: 100vh;

//           background:
//             radial-gradient(
//               circle at 15% 10%,
//               rgba(212, 175, 55, 0.07),
//               transparent 30%
//             ),
//             radial-gradient(
//               circle at 90% 80%,
//               rgba(212, 175, 55, 0.04),
//               transparent 28%
//             ),
//             #070707;
//         }

//         .admin-main-content {
//           min-height: 100vh;

//           margin-left: 270px;

//           width: calc(100% - 270px);

//           position: relative;

//           transition:
//             margin-left 0.28s ease,
//             width 0.28s ease;
//         }

//         /* =====================================================
//            404
//         ===================================================== */

//         .not-found-page {
//           min-height: 100vh;

//           display: flex;

//           align-items: center;

//           justify-content: center;

//           text-align: center;

//           padding: 30px;

//           background:
//             radial-gradient(
//               circle at 50% 30%,
//               rgba(212, 175, 55, 0.08),
//               transparent 35%
//             ),
//             #070707;

//           color: #ffffff;
//         }

//         .not-found-card {
//           max-width: 600px;

//           width: 100%;
//         }

//         .not-found-code {
//           font-size: 100px;

//           font-weight: 900;

//           line-height: 1;

//           letter-spacing: -5px;

//           color: #d4af37;

//           text-shadow:
//             0 0 30px rgba(212, 175, 55, 0.18);
//         }

//         .not-found-card h1 {
//           margin: 25px 0 12px;

//           font-size: 34px;

//           font-weight: 800;
//         }

//         .not-found-card p {
//           margin: 0 0 28px;

//           color: #999;

//           font-size: 16px;
//         }

//         .not-found-card a {
//           display: inline-flex;

//           align-items: center;

//           justify-content: center;

//           padding: 13px 24px;

//           border-radius: 10px;

//           background: #d4af37;

//           color: #080808;

//           text-decoration: none;

//           font-weight: 800;

//           transition: 0.25s ease;
//         }

//         .not-found-card a:hover {
//           transform: translateY(-2px);

//           box-shadow:
//             0 10px 30px
//               rgba(212, 175, 55, 0.2);
//         }

//         /* =====================================================
//            TABLET
//         ===================================================== */

//         @media (max-width: 900px) {
//           .admin-main-content {
//             margin-left: 0;

//             width: 100%;

//             padding-top: 64px;
//           }
//         }

//         /* =====================================================
//            MOBILE
//         ===================================================== */

//         @media (max-width: 700px) {
//           .admin-main-content {
//             padding-bottom: 70px;
//           }

//           .not-found-code {
//             font-size: 75px;
//           }

//           .not-found-card h1 {
//             font-size: 27px;
//           }
//         }
//       `}</style>
//       <Navbar />
//       <Routes>
//         {/* =====================================================
//             PUBLIC ROUTES
//         ===================================================== */}

//         <Route path="/" element={<Home />} />

//         <Route path="/login" element={<Login />} />

//         <Route path="/register" element={<Register />} />

//         <Route path="/programs" element={<Programs />} />

//         <Route path="/gallery" element={<Gallery />} />

//         <Route path="/memberships" element={<Memberships />} />

//         <Route path="/trainers" element={<Trainers />} />

//         {/* =====================================================
//             USER PROTECTED ROUTES
//         ===================================================== */}

//         <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<Dashboard />} />

//           <Route path="/payment" element={<Payment />} />
//         </Route>

//         {/* =====================================================
//             ADMIN PROTECTED ROUTES
//         ===================================================== */}

//         <Route element={<AdminGuard />}>
//           <Route element={<AdminLayout />}>
//             {/* Admin root */}

//             <Route
//               path="/admin"
//               element={<Navigate to="/admin/dashboard" replace />}
//             />

//             {/* Dashboard */}

//             <Route path="/admin/dashboard" element={<AdminDashboard />} />

//             {/* Users */}

//             {/*
//               Add this later when you have:
//               src/pages/admin/ManageUsers.jsx

//               <Route
//                 path="/admin/users"
//                 element={<ManageUsers />}
//               />
//             */}

//             {/* Programs */}

//             <Route path="/admin/programs" element={<ManagePrograms />} />

//             {/* Trainers */}

//             <Route path="/admin/trainers" element={<ManageTrainers />} />

//             {/* Memberships */}

//             <Route path="/admin/memberships" element={<ManageMemberships />} />

//             {/* =================================================
//                 PAYMENT MANAGEMENT
//             ================================================= */}

//             <Route path="/admin/payments" element={<Payments />} />

//             {/* =================================================
//                 PAYMENT ALIASES
//             ================================================= */}

//             <Route
//               path="/admin/payment"
//               element={<Navigate to="/admin/payments" replace />}
//             />

//             <Route
//               path="/admin/payment-history"
//               element={<Navigate to="/admin/payments" replace />}
//             />
//           </Route>
//         </Route>

//         {/* =====================================================
//             HOME ALIAS
//         ===================================================== */}

//         <Route path="/home" element={<Navigate to="/" replace />} />

//         {/* =====================================================
//             404
//         ===================================================== */}

//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       <Footer />
//     </>
//   );
// }

// export default App;

// // import { Routes, Route, Navigate } from "react-router-dom";

// // import Navbar from "./components/Navbar";
// // import Footer from "./components/Footer";
// // import { Guard, AdminGuard } from "./components/Guard";

// // // =========================================================
// // // PUBLIC PAGES
// // // =========================================================

// // import Home from "./pages/Home";
// // import About from "./pages/About";
// // import Programs from "./pages/Programs";
// // import Trainers from "./pages/Trainers";
// // import Memberships from "./pages/Memberships";
// // import Gallery from "./pages/Gallery";
// // import Testimonials from "./pages/Testimonials";
// // import Contact from "./pages/Contact";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";

// // // =========================================================
// // // USER PAGES
// // // =========================================================

// // import Dashboard from "./pages/Dashboard";
// // import FreeTrial from "./pages/FreeTrial";
// // import BookingStatus from "./pages/BookingStatus";

// // // =========================================================
// // // PAYMENT PAGE - MEMBER
// // // =========================================================

// // import Payment from "./pages/Payment";

// // // =========================================================
// // // ADMIN PAGES
// // // =========================================================

// // import Admin from "./pages/admin/Admin";
// // import ManageBookings from "./pages/admin/ManageBookings";
// // import ManageUsers from "./pages/admin/ManageUsers";
// // import ManageContacts from "./pages/admin/ManageContacts";
// // import ManageTrainers from "./pages/admin/ManageTrainers";
// // import ManagePrograms from "./pages/admin/ManagePrograms";
// // import ManageMemberships from "./pages/admin/ManageMemberships";
// // import ManageTestimonials from "./pages/admin/ManageTesimonials";

// // // =========================================================
// // // ADMIN PAYMENT MANAGEMENT
// // // =========================================================

// // import ManagePayments from "./pages/admin/ManagePayments";

// // export default function App() {
// //   return (
// //     <>
// //       {/* =====================================================
// //           NAVBAR
// //       ====================================================== */}

// //       <Navbar />

// //       <Routes>
// //         {/* =====================================================
// //             PUBLIC ROUTES
// //         ====================================================== */}

// //         <Route path="/" element={<Home />} />

// //         <Route path="/about" element={<About />} />

// //         <Route path="/programs" element={<Programs />} />

// //         <Route path="/trainers" element={<Trainers />} />

// //         <Route path="/memberships" element={<Memberships />} />

// //         <Route path="/gallery" element={<Gallery />} />

// //         <Route path="/testimonials" element={<Testimonials />} />

// //         <Route path="/contact" element={<Contact />} />

// //         <Route path="/login" element={<Login />} />

// //         <Route path="/register" element={<Register />} />

// //         {/* =====================================================
// //             MEMBER PAYMENT
// //         ====================================================== */}

// //         <Route path="/payment" element={<Payment />} />

// //         {/* =====================================================
// //             USER PROTECTED ROUTES
// //         ====================================================== */}

// //         <Route element={<Guard />}>
// //           <Route path="/dashboard" element={<Dashboard />} />

// //           <Route path="/free-trial" element={<FreeTrial />} />

// //           <Route path="/booking-status" element={<BookingStatus />} />
// //         </Route>

// //         {/* =====================================================
// //             ADMIN PROTECTED ROUTES
// //         ====================================================== */}

// //         <Route element={<AdminGuard />}>
// //           <Route path="/admin" element={<Admin />} />

// //           <Route path="/admin/bookings" element={<ManageBookings />} />

// //           <Route path="/admin/users" element={<ManageUsers />} />

// //           <Route path="/admin/contacts" element={<ManageContacts />} />

// //           <Route path="/admin/trainers" element={<ManageTrainers />} />

// //           <Route path="/admin/programs" element={<ManagePrograms />} />

// //           <Route path="/admin/memberships" element={<ManageMemberships />} />

// //           <Route path="/admin/testimonials" element={<ManageTestimonials />} />

// //           {/* =================================================
// //               ADMIN PAYMENT HISTORY
// //           ================================================= */}

// //           <Route path="/admin/payments" element={<ManagePayments />} />
// //         </Route>

// //         {/* =====================================================
// //             404
// //         ====================================================== */}

// //         <Route path="*" element={<Navigate to="/" replace />} />
// //       </Routes>

// //       {/* =====================================================
// //           FOOTER
// //       ====================================================== */}

// //       <Footer />
// //     </>
// //   );
// // }
