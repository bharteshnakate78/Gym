import { useEffect, useState } from "react";

import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  getAllBookings,
  updateBookingStatus,
} from "../../services/bookingService";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();

      setBookings(data);
    } catch (error) {
      console.error(error);

      setError("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const updated = await updateBookingStatus(id, status);

      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updated : booking)),
      );
    } catch (error) {
      console.error(error);

      alert("Unable to update booking status.");
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
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight={900} sx={{ mb: 4 }}>
        Free Trial Bookings
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>

              <TableCell>User ID</TableCell>

              <TableCell>Date</TableCell>

              <TableCell>Time</TableCell>

              <TableCell>Goal</TableCell>

              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>

                <TableCell>{booking.userId}</TableCell>

                <TableCell>{booking.preferredDate}</TableCell>

                <TableCell>{booking.preferredTime}</TableCell>

                <TableCell>{booking.fitnessGoal}</TableCell>

                <TableCell>
                  <Select
                    size="small"
                    value={booking.status}
                    onChange={(e) => changeStatus(booking.id, e.target.value)}
                  >
                    <MenuItem value="PENDING">PENDING</MenuItem>

                    <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>

                    <MenuItem value="REJECTED">REJECTED</MenuItem>

                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>

                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
