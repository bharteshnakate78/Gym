import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { FitnessCenter, Search, Timer } from "@mui/icons-material";
import PageIntro from "../components/PageIntro";
import { staticPrograms } from "../data/staticContent";

export default function Programs() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const visiblePrograms = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return staticPrograms.filter((program) => {
      const matchesSearch =
        !keyword ||
        [program.name, program.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesDifficulty =
        difficulty === "All" ||
        String(program.difficulty || "").toLowerCase() ===
          difficulty.toLowerCase();
      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficulty]);

  return (
    <Box sx={{ minHeight: "100vh", background: "#08080a", color: "#fff" }}>
      <PageIntro
        eyebrow="TRAIN WITH PURPOSE"
        title="Programs built around your goal."
        description="Choose a clear path, train with intention, and keep progressing with programs designed for every starting point."
      />
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ display: "flex", gap: 2, mb: 5, flexWrap: "wrap" }}>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search programs"
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {["All", "Beginner", "Intermediate", "Advanced"].map((value) => (
              <Chip
                key={value}
                label={value}
                clickable
                onClick={() => setDifficulty(value)}
                variant={difficulty === value ? "filled" : "outlined"}
                sx={difficulty === value ? activeChipSx : chipSx}
              />
            ))}
          </Box>
        </Box>
        {!visiblePrograms.length && (
          <Typography sx={{ color: "#999" }}>
            No programs match your search.
          </Typography>
        )}
        <Grid container spacing={3}>
          {visiblePrograms.map((program) => (
            <Grid
              key={program.id}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ display: "flex" }}
            >
              <Card sx={cardSx}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={iconSx}>
                    <FitnessCenter />
                  </Box>
                  <Typography sx={titleSx}>{program.name}</Typography>
                  <Typography
                    sx={{ color: "#9b9ba3", lineHeight: 1.75, minHeight: 82 }}
                  >
                    {program.description ||
                      "A structured plan to help you train consistently and progress with confidence."}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={program.difficulty || "All levels"}
                      size="small"
                      sx={chipSx}
                    />
                    <Chip
                      icon={<Timer />}
                      label={program.duration || "Flexible duration"}
                      size="small"
                      sx={chipSx}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

const inputSx = {
  minWidth: { xs: "100%", sm: 280 },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    background: "#151519",
    borderRadius: 1.5,
    "& fieldset": { borderColor: "rgba(255,255,255,.14)" },
  },
};
const cardSx = {
  width: "100%",
  minHeight: 265,
  borderRadius: 2,
  background: "linear-gradient(145deg,#19191e,#0c0c0f)",
  border: "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  transition: ".3s",
  "&:hover": {
    transform: "translateY(-6px)",
    borderColor: "rgba(229,9,20,.55)",
  },
};
const iconSx = {
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ff4d55",
  background: "rgba(229,9,20,.1)",
  borderRadius: 1.5,
  mb: 3,
};
const titleSx = { fontSize: "1.45rem", fontWeight: 900, mb: 1.2 };
const chipSx = {
  color: "#ddd",
  borderColor: "rgba(255,255,255,.16)",
  background: "rgba(255,255,255,.04)",
};
const activeChipSx = {
  color: "#fff",
  background: "#e50914",
  "&:hover": { background: "#ff1a26" },
};
