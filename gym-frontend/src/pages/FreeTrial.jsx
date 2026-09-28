// import { useState } from "react";
// import {
//   Container,
//   Box,
//   TextField,
//   Button,
//   Typography,
//   MenuItem,
//   Alert,
// } from "@mui/material";
// import api from "../services/api";
// export default function FreeTrial() {
//   const [f, setF] = useState({
//       preferredDate: "",
//       preferredTime: "",
//       fitnessGoal: "",
//       notes: "",
//     }),
//     [s, setS] = useState("");
//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/bookings", f);
//       setS("success");
//     } catch (x) {
//       setS(x.response?.data?.message || "Booking failed");
//     }
//   };
//   return (
//     <Container maxWidth="md" sx={{ py: 8 }}>
//       <Typography variant="h3" fontWeight={900} sx={{ mb: 4 }}>
//         Book Free Trial
//       </Typography>
//       {s && (
//         <Alert severity={s === "success" ? "success" : "error"}>
//           {s === "success" ? "Booking submitted." : s}
//         </Alert>
//       )}
//       <Box component="form" onSubmit={submit}>
//         <TextField
//           fullWidth
//           required
//           type="date"
//           label="Date"
//           InputLabelProps={{ shrink: true }}
//           sx={{ my: 1 }}
//           value={f.preferredDate}
//           onChange={(e) => setF({ ...f, preferredDate: e.target.value })}
//         />
//         <TextField
//           fullWidth
//           required
//           type="time"
//           label="Time"
//           InputLabelProps={{ shrink: true }}
//           sx={{ my: 1 }}
//           value={f.preferredTime}
//           onChange={(e) => setF({ ...f, preferredTime: e.target.value })}
//         />
//         <TextField
//           select
//           fullWidth
//           required
//           label="Fitness Goal"
//           sx={{ my: 1 }}
//           value={f.fitnessGoal}
//           onChange={(e) => setF({ ...f, fitnessGoal: e.target.value })}
//         >
//           {[
//             "Weight Loss",
//             "Muscle Building",
//             "Strength",
//             "Cardio",
//             "General Fitness",
//           ].map((x) => (
//             <MenuItem key={x} value={x}>
//               {x}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           fullWidth
//           multiline
//           rows={4}
//           label="Notes"
//           sx={{ my: 1 }}
//           value={f.notes}
//           onChange={(e) => setF({ ...f, notes: e.target.value })}
//         />
//         <Button type="submit" variant="contained" size="large">
//           Submit Booking
//         </Button>
//       </Box>
//     </Container>
//   );
// }

import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";

import { createBooking } from "../services/bookingService";

export default function FreeTrial() {
  const [f, setF] = useState({
    preferredDate: "",
    preferredTime: "",
    fitnessGoal: "",
    notes: "",
  });

  const [s, setS] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setS("");

    console.log("BOOKING DATA:", f);

    try {
      const response = await createBooking(f);

      console.log("BOOKING SUCCESS:", response);

      setS("success");

      setF({
        preferredDate: "",
        preferredTime: "",
        fitnessGoal: "",
        notes: "",
      });
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("SERVER RESPONSE:", error.response?.data);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        error.message ||
        "Booking failed";

      setS(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        fontWeight={900}
        sx={{ mb: 4 }}
      >
        Book Free Trial
      </Typography>

      {s && (
        <Alert
          severity={s === "success" ? "success" : "error"}
          sx={{ mb: 3 }}
        >
          {s === "success"
            ? "Booking submitted successfully."
            : s}
        </Alert>
      )}

      <Box component="form" onSubmit={submit}>
        {/* DATE */}
        <TextField
          fullWidth
          required
          type="date"
          label="Date"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={{ my: 1 }}
          value={f.preferredDate}
          onChange={(e) =>
            setF({
              ...f,
              preferredDate: e.target.value,
            })
          }
        />

        {/* TIME */}
        <TextField
          fullWidth
          required
          type="time"
          label="Time"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={{ my: 1 }}
          value={f.preferredTime}
          onChange={(e) =>
            setF({
              ...f,
              preferredTime: e.target.value,
            })
          }
        />

        {/* FITNESS GOAL */}
        <TextField
          select
          fullWidth
          required
          label="Fitness Goal"
          sx={{ my: 1 }}
          value={f.fitnessGoal}
          onChange={(e) =>
            setF({
              ...f,
              fitnessGoal: e.target.value,
            })
          }
        >
          {[
            "Weight Loss",
            "Muscle Building",
            "Strength",
            "Cardio",
            "General Fitness",
          ].map((goal) => (
            <MenuItem
              key={goal}
              value={goal}
            >
              {goal}
            </MenuItem>
          ))}
        </TextField>

        {/* NOTES */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Notes"
          sx={{ my: 1 }}
          value={f.notes}
          onChange={(e) =>
            setF({
              ...f,
              notes: e.target.value,
            })
          }
        />

        {/* SUBMIT */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontWeight: 700,
          }}
        >
          {loading
            ? "Submitting..."
            : "Submit Booking"}
        </Button>
      </Box>
    </Container>
  );
};