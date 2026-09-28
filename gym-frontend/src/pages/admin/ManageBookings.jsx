import { useEffect, useState } from "react";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";

import {
  getAllBookings,
  updateBookingStatus,
} from "../../services/bookingService";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllBookings();

      console.log("BOOKINGS RESPONSE:", response);

      // Supports both:
      // response = []
      // response = { data: [] }
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setBookings(data);
    } catch (err) {
      console.error("GET BOOKINGS ERROR:", err);

      console.error("STATUS:", err.response?.status);
      console.error("RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Unable to load bookings."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      console.log("UPDATING BOOKING:", {
        id,
        status,
      });

      await updateBookingStatus(id, status);

      await loadBookings();
    } catch (err) {
      console.error("UPDATE BOOKING ERROR:", err);

      console.error("STATUS:", err.response?.status);
      console.error("RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Unable to update booking."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "warning";

      case "CONFIRMED":
      case "APPROVED":
        return "success";

      case "REJECTED":
        return "error";

      case "COMPLETED":
        return "info";

      case "CANCELLED":
        return "default";

      default:
        return "default";
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: {
          xs: 4,
          md: 7,
        },
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            fontSize: {
              xs: "2rem",
              md: "3rem",
            },
            letterSpacing: "-1px",
          }}
        >
          Manage Bookings
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Review and manage free trial bookings.
        </Typography>
      </Box>

      {/* ERROR */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* LOADING */}
      {loading ? (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Loading bookings...
            </Typography>
          </Stack>
        </Box>
      ) : bookings.length === 0 ? (
        /* EMPTY */
        <Card
          sx={{
            borderRadius: 4,
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
          >
            No bookings found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            New free-trial bookings will appear here.
          </Typography>
        </Card>
      ) : (
        /* BOOKINGS */
        <Stack spacing={3}>
          {bookings.map((booking) => {
            const status =
              booking.status?.toUpperCase() || "PENDING";

            return (
              <Card
                key={booking.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "0.2s",

                  "&:hover": {
                    boxShadow:
                      "0 12px 35px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{
                      xs: "column",
                      md: "row",
                    }}
                    spacing={3}
                    justifyContent="space-between"
                    alignItems={{
                      xs: "stretch",
                      md: "center",
                    }}
                  >
                    {/* BOOKING INFO */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={900}
                      >
                        Booking #{booking.id}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        User:{" "}
                        {booking.userEmail ||
                          booking.email ||
                          "N/A"}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        spacing={2}
                      >
                        <Typography>
                          <strong>Date:</strong>{" "}
                          {booking.preferredDate || "N/A"}
                        </Typography>

                        <Typography>
                          <strong>Time:</strong>{" "}
                          {booking.preferredTime || "N/A"}
                        </Typography>
                      </Stack>

                      <Typography sx={{ mt: 1 }}>
                        <strong>Goal:</strong>{" "}
                        {booking.fitnessGoal || "N/A"}
                      </Typography>

                      {booking.notes && (
                        <Typography
                          sx={{
                            mt: 1,
                            color: "text.secondary",
                          }}
                        >
                          <strong>Notes:</strong>{" "}
                          {booking.notes}
                        </Typography>
                      )}
                    </Box>

                    {/* STATUS */}
                    <Stack
                      spacing={1.5}
                      alignItems={{
                        xs: "stretch",
                        md: "flex-end",
                      }}
                    >
                      <Chip
                        label={status}
                        color={getStatusColor(status)}
                        sx={{
                          fontWeight: 800,
                          width: "fit-content",
                        }}
                      />

                      <Select
                        size="small"
                        value={status}
                        disabled={updatingId === booking.id}
                        onChange={(e) =>
                          changeStatus(
                            booking.id,
                            e.target.value
                          )
                        }
                        sx={{
                          minWidth: 160,
                          borderRadius: 2,
                        }}
                      >
                        <MenuItem value="PENDING">
                          Pending
                        </MenuItem>

                        <MenuItem value="CONFIRMED">
                          Confirmed
                        </MenuItem>

                        <MenuItem value="REJECTED">
                          Rejected
                        </MenuItem>

                        <MenuItem value="COMPLETED">
                          Completed
                        </MenuItem>

                        <MenuItem value="CANCELLED">
                          Cancelled
                        </MenuItem>
                      </Select>

                      {updatingId === booking.id && (
                        <CircularProgress size={20} />
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}

// import { useEffect, useState } from "react";

// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Stack,
//   Chip,
//   Select,
//   MenuItem,
//   Button,
//   Alert,
// } from "@mui/material";

// import {
//   getAllBookings,
//   updateBookingStatus,
// } from "../../services/bookingService";

// export default function ManageBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       const data = await getAllBookings();

//       setBookings(data);
//     } catch (err) {
//       console.error(err);

//       setError("Unable to load bookings.");
//     }
//   };

//   const changeStatus = async (id, status) => {
//     try {
//       await updateBookingStatus(id, status);

//       loadBookings();
//     } catch (err) {
//       console.error(err);

//       setError(err.response?.data?.message || "Unable to update booking.");
//     }
//   };

//   return (
//     <Container sx={{ py: 6 }}>
//       <Typography variant="h3" fontWeight={900} sx={{ mb: 4 }}>
//         Manage Bookings
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       <Stack spacing={3}>
//         {bookings.map((booking) => (
//           <Card key={booking.id}>
//             <CardContent>
//               <Stack
//                 direction={{
//                   xs: "column",
//                   md: "row",
//                 }}
//                 spacing={2}
//                 justifyContent="space-between"
//                 alignItems={{
//                   xs: "flex-start",
//                   md: "center",
//                 }}
//               >
//                 <div>
//                   <Typography variant="h6" fontWeight={800}>
//                     Booking #{booking.id}
//                   </Typography>

//                   <Typography>Date: {booking.preferredDate}</Typography>

//                   <Typography>Time: {booking.preferredTime}</Typography>

//                   <Typography>Goal: {booking.fitnessGoal}</Typography>
//                 </div>

//                 <Chip label={booking.status} />

//                 {/* <Select
//                   size="small"
//                   value={booking.status}
//                   onChange={(e) => changeStatus(booking.id, e.target.value)}
//                 >
//                   <MenuItem value="PENDING">Pending</MenuItem>

//                   <MenuItem value="APPROVED">Approved</MenuItem>

//                   <MenuItem value="REJECTED">Rejected</MenuItem>

//                   <MenuItem value="COMPLETED">Completed</MenuItem>

//                   <MenuItem value="CANCELLED">Cancelled</MenuItem>
//                 </Select> */}

//                 <Select
//                   size="small"
//                   value={booking.status}
//                   onChange={(e) => changeStatus(booking.id, e.target.value)}
//                 >
//                   <MenuItem value="PENDING">Pending</MenuItem>

//                   <MenuItem value="CONFIRMED">Confirmed</MenuItem>

//                   <MenuItem value="REJECTED">Rejected</MenuItem>

//                   <MenuItem value="COMPLETED">Completed</MenuItem>

//                   <MenuItem value="CANCELLED">Cancelled</MenuItem>
//                 </Select>
//               </Stack>
//             </CardContent>
//           </Card>
//         ))}
//       </Stack>
//     </Container>
//   );
// }
