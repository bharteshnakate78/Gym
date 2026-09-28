import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
export default function Admin() {
  const x = [
    ["Bookings", "/admin/bookings"],
    ["Users", "/admin/users"],
    ["Trainers", "/admin/trainers"],
    ["Programs", "/admin/programs"],
    ["Memberships", "/admin/memberships"],
    ["Contacts", "/admin/contacts"],
  ];
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={900}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {x.map(([n, p]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={900}>
                  {n}
                </Typography>
                <Button
                  component={Link}
                  to={p}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
