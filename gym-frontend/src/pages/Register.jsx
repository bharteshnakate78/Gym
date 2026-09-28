import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Email, FitnessCenter, Lock, Phone, Person } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });

      /*
       * Registration does not automatically authenticate
       * the user in the current AuthContext.
       *
       * Therefore redirect to Login.
       */
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          email: form.email.trim(),
        },
      });
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Registration failed.",
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
          {/* HEADER */}
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
                fontSize: 30,
                fontWeight: 1000,
              }}
            >
              CREATE{" "}
              <Box
                component="span"
                sx={{
                  color: "#e50914",
                }}
              >
                ACCOUNT
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#666",
                mt: 1,
                fontSize: 13,
              }}
            >
              Start your fitness journey today.
            </Typography>
          </Box>

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
              name="name"
              label="Full Name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person
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
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              sx={{
                ...inputStyle,
                mt: 2,
              }}
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
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              sx={{
                ...inputStyle,
                mt: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone
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
              type="password"
              label="Password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
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

                fontWeight: 900,
                fontSize: 14,
                textTransform: "none",

                background: "linear-gradient(135deg,#e50914,#980008)",

                boxShadow: "0 10px 30px rgba(229,9,20,.20)",

                "&:hover": {
                  background: "linear-gradient(135deg,#ff2631,#c00009)",
                },

                "&:disabled": {
                  background: "#333",
                },
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Box>

          {/* LOGIN */}
          <Typography
            textAlign="center"
            sx={{
              mt: 3,
              color: "#777",
              fontSize: 13,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#e50914",
                fontWeight: 900,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Typography>
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
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// export default function Register() {
//   const { register } = useAuth(),
//     nav = useNavigate();
//   const [f, setF] = useState({ name: "", email: "", password: "", phone: "" }),
//     [err, setErr] = useState("");
//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await register(f);
//       nav("/dashboard");
//     } catch (x) {
//       setErr(x.response?.data?.message || "Registration failed");
//     }
//   };
//   return (
//     <Container maxWidth="sm" sx={{ py: 8 }}>
//       <Box className="auth">
//         <Typography variant="h4" fontWeight={900}>
//           Create Account
//         </Typography>
//         {err && (
//           <Alert severity="error" sx={{ my: 2 }}>
//             {err}
//           </Alert>
//         )}
//         {["name", "email", "phone", "password"].map((k) => (
//           <TextField
//             key={k}
//             fullWidth
//             required={k !== "phone"}
//             type={
//               k === "password" ? "password" : k === "email" ? "email" : "text"
//             }
//             label={k[0].toUpperCase() + k.slice(1)}
//             sx={{ my: 1 }}
//             value={f[k]}
//             onChange={(e) => setF({ ...f, [k]: e.target.value })}
//           />
//         ))}
//         <Button
//           fullWidth
//           variant="contained"
//           onClick={submit}
//           size="large"
//           sx={{ mt: 2 }}
//         >
//           Create Account
//         </Button>
//       </Box>
//     </Container>
//   );
// }
