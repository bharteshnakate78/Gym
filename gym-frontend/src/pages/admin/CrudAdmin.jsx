import { useCallback, useEffect, useState } from "react";

import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import api from "../../services/api";

export default function CrudAdmin({ title, endpoint, fields }) {
  const [d, setD] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [f, setF] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(endpoint);

      console.log(`${endpoint} response:`, response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setD(data);
    } catch (error) {
      console.error(`${endpoint} error:`, error);

      setError(
        error.response?.data?.message ||
          "Unable to load data. Check the backend.",
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const emptyForm = () => {
    return Object.fromEntries(
      fields.map(([key]) => [key, ""]),
    );
  };

  const start = (item = null) => {
    setEdit(item);

    if (item) {
      const form = {};

      fields.forEach(([key]) => {
        form[key] = item[key] ?? "";
      });

      setF(form);
    } else {
      setF(emptyForm());
    }

    setError("");
    setOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setOpen(false);
    setEdit(null);
    setF({});
  };

  const handleChange = (key, value) => {
    setF((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const save = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {};

      fields.forEach(([key]) => {
        const value = f[key];

        if (
          ["price", "monthlyFee", "durationMonths", "rating"].includes(key)
        ) {
          payload[key] =
            value === "" ? null : Number(value);
        } else {
          payload[key] = value;
        }
      });

      console.log("Saving payload:", payload);

      if (edit) {
        await api.put(`${endpoint}/${edit.id}`, payload);
      } else {
        await api.post(endpoint, payload);
      }

      closeDialog();
      await load();
    } catch (error) {
      console.error("Save error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save data.",
      );
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`${endpoint}/${id}`);

      await load();
    } catch (error) {
      console.error("Delete error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete item.",
      );
    }
  };

  const getDisplayText = (item) => {
    return (
      item.description ||
      item.specialization ||
      item.benefits ||
      item.message ||
      item.email ||
      ""
    );
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={900}>
        {title}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{ my: 3 }}
        onClick={() => start()}
      >
        Add
      </Button>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : d.length === 0 ? (
        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{ py: 5 }}
        >
          No data available yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {d.map((x) => (
            <Grid
              size={{ xs: 12, md: 6 }}
              key={x.id}
            >
              <Card className="card">
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    {x.name || x.title || `#${x.id}`}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {getDisplayText(x)}
                  </Typography>

                  {x.monthlyFee !== undefined && (
                    <Typography
                      fontWeight={800}
                      sx={{ mt: 1 }}
                    >
                      ₹{x.monthlyFee}
                    </Typography>
                  )}

                  <Box sx={{ mt: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => start(x)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => del(x.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {edit ? "Edit" : "Add"} {title}
        </DialogTitle>

        <DialogContent>
          {fields.map(([key, label]) => {
            const isMultiline = [
              "description",
              "benefits",
              "certifications",
              "message",
            ].includes(key);

            const isNumber = [
              "price",
              "monthlyFee",
              "durationMonths",
              "rating",
            ].includes(key);

            return (
              <TextField
                key={key}
                fullWidth
                required
                label={label}
                value={f[key] ?? ""}
                multiline={isMultiline}
                minRows={isMultiline ? 3 : undefined}
                type={isNumber ? "number" : "text"}
                sx={{ my: 1 }}
                onChange={(e) =>
                  handleChange(key, e.target.value)
                }
              />
            );
          })}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeDialog}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}