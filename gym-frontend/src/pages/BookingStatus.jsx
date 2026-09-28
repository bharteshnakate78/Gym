import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Box,
} from "@mui/material";

import api from "../services/api";

export default function BookingStatus() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");

      console.log("My bookings:", response.data);

      setBookings(response.data);
    } catch (err) {
      console.error("Booking API error:", err);

      setError(err.response?.data?.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";

     case "CONFIRMED":
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
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={900} sx={{ mb: 4 }}>
        My Bookings
      </Typography>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && bookings.length === 0 && (
        <Alert severity="info">You have no bookings yet.</Alert>
      )}

      {!loading && !error && bookings.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {bookings.map((booking) => (
            <Card key={booking.id} className="card">
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight={900}>
                    Free Trial
                  </Typography>

                  <Chip
                    label={booking.status || "PENDING"}
                    color={getStatusColor(booking.status)}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography>
                  <strong>Date:</strong> {booking.preferredDate}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  <strong>Time:</strong> {booking.preferredTime}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  <strong>Fitness Goal:</strong> {booking.fitnessGoal}
                </Typography>

                {booking.notes && (
                  <Typography sx={{ mt: 1 }}>
                    <strong>Notes:</strong> {booking.notes}
                  </Typography>
                )}

                {booking.createdAt && (
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    Booking created:{" "}
                    {new Date(booking.createdAt).toLocaleString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
