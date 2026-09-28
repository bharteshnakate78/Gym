import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { CalendarMonth, FitnessCenter, Refresh } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/dashboard",
        },
      });

      return;
    }

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bookings/my");

        setBookings(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Dashboard bookings error:", err);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load your bookings.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080a",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: "#e50914" }} />

          <Typography
            sx={{
              color: "#777",
              fontWeight: 700,
            }}
          >
            Loading dashboard...
          </Typography>
        </Stack>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    const value = String(status || "").toUpperCase();

    if (
      value === "APPROVED" ||
      value === "CONFIRMED" ||
      value === "COMPLETED"
    ) {
      return "success";
    }

    if (value === "REJECTED" || value === "CANCELLED") {
      return "error";
    }

    return "warning";
  };

  const formatTime = (time) => {
    if (!time) return "--";

    return String(time).slice(0, 5);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 5, md: 8 },

        background:
          "radial-gradient(circle at 10% 10%, rgba(229,9,20,.08), transparent 25%), radial-gradient(circle at 90% 20%, rgba(229,9,20,.06), transparent 25%), #08080a",
      }}
    >
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box
          sx={{
            mb: 5,
            p: { xs: 3, md: 4 },
            borderRadius: 4,

            background: "linear-gradient(145deg,#17171c,#0d0d10)",

            border: "1px solid rgba(255,255,255,.07)",

            boxShadow: "0 20px 60px rgba(0,0,0,.35)",
          }}
        >
          <Typography
            sx={{
              color: "#e50914",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 2,
              mb: 1,
            }}
          >
            MEMBER DASHBOARD
          </Typography>

          <Typography
            sx={{
              color: "#fff",
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
              fontWeight: 1000,
              lineHeight: 1.1,
            }}
          >
            Hello, {user.name || "Member"} 👋
          </Typography>

          <Typography
            sx={{
              color: "#777",
              mt: 1,
            }}
          >
            Track your fitness journey and manage your bookings.
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              component={Link}
              to="/free-trial"
              variant="contained"
              startIcon={<FitnessCenter />}
              sx={{
                minHeight: 48,
                px: 3,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 900,

                background: "linear-gradient(135deg,#e50914,#980008)",

                "&:hover": {
                  background: "linear-gradient(135deg,#ff2731,#bd0009)",
                },
              }}
            >
              Book Free Trial
            </Button>

            <Button
              component={Link}
              to="/booking-status"
              variant="outlined"
              startIcon={<CalendarMonth />}
              sx={{
                minHeight: 48,
                px: 3,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 900,

                color: "#fff",
                borderColor: "rgba(255,255,255,.15)",

                "&:hover": {
                  borderColor: "#e50914",
                  background: "rgba(229,9,20,.08)",
                },
              }}
            >
              My Bookings
            </Button>
          </Stack>
        </Box>

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              background: "rgba(229,9,20,.08)",
              color: "#ff7b81",
              border: "1px solid rgba(229,9,20,.25)",
            }}
          >
            {error}
          </Alert>
        )}

        {/* BOOKINGS */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 1000,
              }}
            >
              Your Bookings
            </Typography>

            <Typography
              sx={{
                color: "#666",
                fontSize: 13,
                mt: 0.5,
              }}
            >
              Your recent free-trial bookings
            </Typography>
          </Box>

          <Button
            onClick={() => window.location.reload()}
            startIcon={<Refresh />}
            sx={{
              color: "#aaa",
              textTransform: "none",
              fontWeight: 800,

              "&:hover": {
                color: "#fff",
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "#e50914" }} />
          </Box>
        ) : bookings.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 4,

              background: "linear-gradient(145deg,#151519,#0d0d10)",

              border: "1px solid rgba(255,255,255,.07)",
            }}
          >
            <FitnessCenter
              sx={{
                color: "#e50914",
                fontSize: 48,
                mb: 2,
              }}
            />

            <Typography
              sx={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              No bookings yet
            </Typography>

            <Typography
              sx={{
                color: "#666",
                mt: 1,
                mb: 3,
              }}
            >
              Start your fitness journey by booking a free trial.
            </Typography>

            <Button
              component={Link}
              to="/free-trial"
              variant="contained"
              sx={{
                borderRadius: 2.5,
                fontWeight: 900,
                textTransform: "none",
                background: "linear-gradient(135deg,#e50914,#980008)",
              }}
            >
              Book Free Trial
            </Button>
          </Card>
        ) : (
          <Stack spacing={2}>
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                elevation={0}
                sx={{
                  borderRadius: 3,

                  background: "linear-gradient(145deg,#17171c,#0d0d10)",

                  border: "1px solid rgba(255,255,255,.07)",

                  transition: ".3s",

                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "rgba(229,9,20,.35)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2.5, md: 3 },
                  }}
                >
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                      xs: "flex-start",
                      sm: "center",
                    }}
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: 16,
                        }}
                      >
                        {booking.preferredDate || "Date not available"}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#999",
                          mt: 0.5,
                        }}
                      >
                        Time: {formatTime(booking.preferredTime)}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#777",
                          mt: 1,
                          fontSize: 13,
                        }}
                      >
                        Goal: {booking.fitnessGoal || "Fitness"}
                      </Typography>
                    </Box>

                    <Chip
                      label={booking.status || "PENDING"}
                      color={getStatusColor(booking.status)}
                      sx={{
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

// import { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Chip,
//   Button,
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// export default function Dashboard() {
//   const { user } = useAuth();
//   const [d, setD] = useState([]);
//   useEffect(() => {
//     api.get("/bookings/my").then((r) => setD(r.data));
//   }, []);
//   return (
//     <Container sx={{ py: 8 }}>
//       <Typography variant="h3" fontWeight={900}>
//         Hello, {user.name}
//       </Typography>
//       <Button
//         component={Link}
//         to="/free-trial"
//         variant="contained"
//         sx={{ my: 3 }}
//       >
//         Book Free Trial
//       </Button>
//       {d.map((b) => (
//         <Card key={b.id} sx={{ mb: 2 }}>
//           <CardContent>
//             <Typography>
//               {b.preferredDate} at {String(b.preferredTime).slice(0, 5)}
//             </Typography>
//             <Typography color="text.secondary">{b.fitnessGoal}</Typography>
//             <Chip label={b.status} />
//           </CardContent>
//         </Card>
//       ))}
//       {!d.length && (
//         <Typography color="text.secondary">No bookings yet.</Typography>
//       )}
//     </Container>
//   );
// }
