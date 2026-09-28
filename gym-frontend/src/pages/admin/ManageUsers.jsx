import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
} from "@mui/material";
import api from "../../services/api";
export default function ManageUsers() {
  const [d, setD] = useState([]);
  useEffect(() => {
    api.get("/admin/users").then((r) => setD(r.data));
  }, []);
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={900}>
        Users
      </Typography>
      <Paper sx={{ mt: 3, overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {d.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>{u.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
