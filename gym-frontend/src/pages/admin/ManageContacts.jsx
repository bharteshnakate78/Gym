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
  Button,
} from "@mui/material";
import api from "../../services/api";
export default function ManageContacts() {
  const [d, setD] = useState([]);
  const load = () => api.get("/contacts").then((r) => setD(r.data));
  useEffect(load, []);
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={900}>
        Contacts
      </Typography>
      <Paper sx={{ mt: 3, overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {d.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.message}</TableCell>
                <TableCell>
                  {c.replied ? (
                    "Replied"
                  ) : (
                    <Button
                      onClick={() =>
                        api.put(`/contacts/${c.id}/replied`).then(load)
                      }
                    >
                      Mark Replied
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
