import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

import { Add, Delete, Edit } from "@mui/icons-material";

import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/testimonialService";

export default function ManageTestimonials() {
  const [items, setItems] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    memberName: "",
    message: "",
    rating: 5,
  });

  const loadData = async () => {
    try {
      const data = await getTestimonials();

      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item.id);

      setForm({
        memberName: item.memberName || "",
        message: item.message || "",
        rating: item.rating || 5,
      });
    } else {
      setEditingId(null);

      setForm({
        memberName: "",
        message: "",
        rating: 5,
      });
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const data = {
        memberName: form.memberName,
        message: form.message,
        rating: Number(form.rating),
      };

      if (editingId) {
        await updateTestimonial(editingId, data);
      } else {
        await createTestimonial(data);
      }

      setOpen(false);

      loadData();
    } catch (error) {
      console.error("Save testimonial failed:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) {
      return;
    }

    try {
      await deleteTestimonial(id);

      loadData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Container sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={900}>
          Manage Testimonials
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Testimonial
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 3,
        }}
      >
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <Typography variant="h6" fontWeight={800}>
                {item.memberName}
              </Typography>

              <Rating value={Number(item.rating)} readOnly sx={{ my: 1 }} />

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {item.message}
              </Typography>

              <IconButton color="primary" onClick={() => handleOpen(item)}>
                <Edit />
              </IconButton>

              <IconButton color="error" onClick={() => handleDelete(item.id)}>
                <Delete />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? "Edit Testimonial" : "Add Testimonial"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Member Name"
            name="memberName"
            value={form.memberName}
            onChange={handleChange}
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <Typography sx={{ mb: 1 }}>Rating</Typography>

          <Rating
            value={Number(form.rating)}
            onChange={(e, value) =>
              setForm({
                ...form,
                rating: value || 1,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
