import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Container,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import {
  AdminPanelSettings,
  Email,
  FitnessCenter,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState("USER");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleRoleChange = (_, newRole) => {
    if (!newRole) return;

    setRole(newRole);
    setError("");
  };

  const normalizeRole = (value) => {
    return String(value || "")
      .replace(/^ROLE_/i, "")
      .trim()
      .toUpperCase();
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const actualRole = normalizeRole(response?.role);

      console.log("LOGIN RESPONSE:", response);
      console.log("ACTUAL ROLE:", actualRole);

      if (!actualRole) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error("Role information was not returned by the server.");
      }

      /*
       * USER selected USER but account is ADMIN
       */
      if (role === "USER" && actualRole === "ADMIN") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "This is an administrator account. Please select Admin Login.",
        );

        return;
      }

      /*
       * ADMIN selected ADMIN but account is USER
       */
      if (role === "ADMIN" && actualRole !== "ADMIN") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError("This account does not have administrator access.");

        return;
      }

      /*
       * Redirect to requested page if one exists.
       *
       * Example:
       * Home → Book Free Trial → Login
       *
       * After login:
       * Login → Free Trial
       */
      const requestedPath = location.state?.from;

      if (actualRole === "ADMIN") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate(requestedPath || "/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        py: 7,

        background:
          "radial-gradient(circle at 50% 10%, rgba(229,9,20,.10), transparent 30%), #08080a",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },

            borderRadius: 4,

            background: "linear-gradient(145deg,#18181d,#0d0d10)",

            border: "1px solid rgba(255,255,255,.08)",

            boxShadow: "0 30px 90px rgba(0,0,0,.55)",
          }}
        >
          {/* LOGO */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 62,
                height: 62,
                mx: "auto",
                mb: 2,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 3,

                background: "linear-gradient(135deg,#e50914,#850007)",

                boxShadow: "0 12px 35px rgba(229,9,20,.25)",
              }}
            >
              <FitnessCenter
                sx={{
                  color: "#fff",
                  fontSize: 32,
                }}
              />
            </Box>

            <Typography
              sx={{
                color: "#fff",
                fontSize: 32,
                fontWeight: 1000,
              }}
            >
              FIT
              <Box
                component="span"
                sx={{
                  color: "#e50914",
                }}
              >
                NESS
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#666",
                mt: 1,
                fontSize: 13,
              }}
            >
              Welcome back. Let's get stronger.
            </Typography>
          </Box>

          {/* ROLE */}
          <Typography
            sx={{
              color: "#ccc",
              fontWeight: 800,
              mb: 1,
            }}
          >
            Login As
          </Typography>

          <ToggleButtonGroup
            fullWidth
            exclusive
            value={role}
            onChange={handleRoleChange}
            sx={{
              mb: 3,

              "& .MuiToggleButton-root": {
                py: 1.4,
                color: "#888",
                borderColor: "rgba(255,255,255,.1)",
                fontWeight: 800,
                textTransform: "none",
              },

              "& .MuiToggleButton-root.Mui-selected": {
                color: "#fff",
                background: "linear-gradient(135deg,#e50914,#a00008)",
              },

              "& .MuiToggleButton-root.Mui-selected:hover": {
                background: "linear-gradient(135deg,#ff2631,#bd0009)",
              },
            }}
          >
            <ToggleButton value="USER">
              <Person sx={{ mr: 1 }} />
              User
            </ToggleButton>

            <ToggleButton value="ADMIN">
              <AdminPanelSettings sx={{ mr: 1 }} />
              Admin
            </ToggleButton>
          </ToggleButtonGroup>

          {/* ERROR */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* FORM */}
          <Box component="form" onSubmit={submit}>
            <TextField
              fullWidth
              required
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email
                      sx={{
                        color: "#e50914",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              sx={{
                ...inputStyle,
                mt: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      sx={{
                        color: "#e50914",
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      sx={{
                        color: "#777",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                minHeight: 52,
                borderRadius: 2.5,

                fontSize: 14,
                fontWeight: 900,
                textTransform: "none",

                background: "linear-gradient(135deg,#e50914,#980008)",

                boxShadow: "0 10px 30px rgba(229,9,20,.20)",

                "&:hover": {
                  background: "linear-gradient(135deg,#ff2631,#c00009)",
                  transform: "translateY(-2px)",
                },

                "&:disabled": {
                  background: "#333",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={25} sx={{ color: "#fff" }} />
              ) : (
                `Login as ${role === "ADMIN" ? "Admin" : "User"}`
              )}
            </Button>
          </Box>

          {/* REGISTER */}
          {role === "USER" && (
            <Typography
              textAlign="center"
              sx={{
                mt: 3,
                color: "#777",
                fontSize: 13,
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#e50914",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Register Now
              </Link>
            </Typography>
          )}

          {role === "ADMIN" && (
            <Typography
              textAlign="center"
              sx={{
                mt: 3,
                color: "#555",
                fontSize: 12,
              }}
            >
              Administrator access is restricted to authorized accounts.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

const inputStyle = {
  "& .MuiInputLabel-root": {
    color: "#777",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#e50914",
  },

  "& .MuiOutlinedInput-root": {
    color: "#fff",
    background: "#0b0b0f",

    "& fieldset": {
      borderColor: "rgba(255,255,255,.10)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,.22)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#e50914",
    },
  },
};

// import { useState } from "react";
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   Paper,
//   ToggleButton,
//   ToggleButtonGroup,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";

// import {
//   Email,
//   Lock,
//   Visibility,
//   VisibilityOff,
//   AdminPanelSettings,
//   Person,
//   FitnessCenter,
// } from "@mui/icons-material";

// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [role, setRole] = useState("USER");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (error) {
//       setError("");
//     }
//   };

//   const handleRoleChange = (_, newRole) => {
//     if (newRole) {
//       setRole(newRole);
//       setError("");
//     }
//   };

//   const submit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const user = await login(form);

//       /*
//        * Backend/JWT role is the actual source of truth.
//        * The selected role is used only as a UI expectation.
//        */

//       const actualRole = user?.role;

//       if (!actualRole) {
//         throw new Error("Role information missing from login response");
//       }

//       // Prevent user from selecting USER and logging into ADMIN area
//       if (role === "ADMIN" && actualRole !== "ADMIN") {
//         setError("This account does not have administrator access.");
//         return;
//       }

//       if (role === "USER" && actualRole === "ADMIN") {
//         setError("Please select Admin Login for this administrator account.");
//         return;
//       }

//       // Redirect according to backend role
//       if (actualRole === "ADMIN") {
//         navigate("/admin");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       console.error("Login error:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Invalid email or password.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "85vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         py: 6,
//         background: "#0b0b0f",
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={10}
//           sx={{
//             p: { xs: 3, sm: 5 },
//             borderRadius: 4,
//             background: "#15151b",
//             border: "1px solid #29292f",
//           }}
//         >
//           {/* Logo */}
//           <Box textAlign="center" sx={{ mb: 3 }}>
//             <FitnessCenter
//               sx={{
//                 fontSize: 45,
//                 color: "#e53935",
//                 mb: 1,
//               }}
//             />

//             <Typography
//               variant="h4"
//               fontWeight={900}
//               sx={{
//                 color: "#fff",
//               }}
//             >
//               FIT<span style={{ color: "#e53935" }}>NESS</span>
//             </Typography>

//             <Typography
//               sx={{
//                 color: "#888",
//                 mt: 1,
//               }}
//             >
//               Welcome back! Login to continue.
//             </Typography>
//           </Box>

//           {/* Role Selection */}
//           <Typography
//             sx={{
//               color: "#ccc",
//               fontWeight: 700,
//               mb: 1,
//             }}
//           >
//             Login As
//           </Typography>

//           <ToggleButtonGroup
//             fullWidth
//             exclusive
//             value={role}
//             onChange={handleRoleChange}
//             sx={{
//               mb: 3,
//               "& .MuiToggleButton-root": {
//                 py: 1.4,
//                 color: "#aaa",
//                 borderColor: "#333",
//                 fontWeight: 700,
//                 textTransform: "none",
//               },

//               "& .MuiToggleButton-root.Mui-selected": {
//                 color: "#fff",
//                 background: "#e53935",
//               },

//               "& .MuiToggleButton-root.Mui-selected:hover": {
//                 background: "#c62828",
//               },
//             }}
//           >
//             <ToggleButton value="USER">
//               <Person sx={{ mr: 1 }} />
//               User
//             </ToggleButton>

//             <ToggleButton value="ADMIN">
//               <AdminPanelSettings sx={{ mr: 1 }} />
//               Admin
//             </ToggleButton>
//           </ToggleButtonGroup>

//           {/* Error */}
//           {error && (
//             <Alert
//               severity="error"
//               sx={{
//                 mb: 2,
//                 borderRadius: 2,
//               }}
//             >
//               {error}
//             </Alert>
//           )}

//           {/* Login Form */}
//           <Box component="form" onSubmit={submit}>
//             {/* Email */}
//             <TextField
//               fullWidth
//               required
//               type="email"
//               name="email"
//               label="Email Address"
//               placeholder="Enter your email"
//               value={form.email}
//               onChange={handleChange}
//               autoComplete="email"
//               sx={inputStyle}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Email sx={{ color: "#e53935" }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Password */}
//             <TextField
//               fullWidth
//               required
//               name="password"
//               label="Password"
//               placeholder="Enter your password"
//               type={showPassword ? "text" : "password"}
//               value={form.password}
//               onChange={handleChange}
//               autoComplete="current-password"
//               sx={{ ...inputStyle, mt: 2 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Lock sx={{ color: "#e53935" }} />
//                   </InputAdornment>
//                 ),

//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword(!showPassword)}
//                       edge="end"
//                       sx={{ color: "#aaa" }}
//                       type="button"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Login Button */}
//             <Button
//               fullWidth
//               variant="contained"
//               type="submit"
//               size="large"
//               disabled={loading}
//               sx={{
//                 mt: 3,
//                 py: 1.6,
//                 borderRadius: 2,
//                 fontWeight: 800,
//                 fontSize: "1rem",
//                 background: "#e53935",

//                 "&:hover": {
//                   background: "#c62828",
//                 },

//                 "&:disabled": {
//                   background: "#555",
//                 },
//               }}
//             >
//               {loading ? (
//                 <CircularProgress size={25} color="inherit" />
//               ) : (
//                 `Login as ${role === "ADMIN" ? "Admin" : "User"}`
//               )}
//             </Button>
//           </Box>

//           {/* Register */}
//           {role === "USER" && (
//             <Typography
//               textAlign="center"
//               sx={{
//                 mt: 3,
//                 color: "#999",
//               }}
//             >
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 style={{
//                   color: "#e53935",
//                   fontWeight: 700,
//                   textDecoration: "none",
//                 }}
//               >
//                 Register Now
//               </Link>
//             </Typography>
//           )}

//           {/* Admin information */}
//           {role === "ADMIN" && (
//             <Typography
//               textAlign="center"
//               sx={{
//                 mt: 3,
//                 color: "#777",
//                 fontSize: "0.85rem",
//               }}
//             >
//               Administrator access is restricted to authorized accounts.
//             </Typography>
//           )}
//         </Paper>
//       </Container>
//     </Box>
//   );
// }

// const inputStyle = {
//   "& .MuiInputLabel-root": {
//     color: "#999",
//   },

//   "& .MuiInputLabel-root.Mui-focused": {
//     color: "#e53935",
//   },

//   "& .MuiOutlinedInput-root": {
//     color: "#fff",
//     background: "#0f0f14",

//     "& fieldset": {
//       borderColor: "#333",
//     },

//     "&:hover fieldset": {
//       borderColor: "#555",
//     },

//     "&.Mui-focused fieldset": {
//       borderColor: "#e53935",
//     },
//   },
// };
