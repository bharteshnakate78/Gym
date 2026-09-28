import { useEffect, useState } from "react";

import {
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

import { getMyBookings } from "../services/bookingService";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getMyBookings();

      setBookings(data);
    } catch (error) {
      console.error(error);

      setError("Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (status) => {
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

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={900} sx={{ mb: 4 }}>
        My Free Trial Bookings
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {!error && bookings.length === 0 && (
        <Typography color="text.secondary">
          You have no bookings yet.
        </Typography>
      )}

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            key={booking.id}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={800}>
                  Free Trial
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  <strong>Date:</strong> {booking.preferredDate}
                </Typography>

                <Typography>
                  <strong>Time:</strong> {booking.preferredTime}
                </Typography>

                <Typography>
                  <strong>Goal:</strong> {booking.fitnessGoal}
                </Typography>

                {booking.notes && (
                  <Typography sx={{ mt: 1 }}>
                    <strong>Notes:</strong> {booking.notes}
                  </Typography>
                )}

                <Chip
                  label={booking.status}
                  color={getColor(booking.status)}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
