import { staticTrainers } from "../data/staticContent";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { FitnessCenter, WorkspacePremium } from "@mui/icons-material";
import PageIntro from "../components/PageIntro";

export default function Trainers() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#08080a", color: "#fff" }}>
      <PageIntro
        eyebrow="THE COACHING TEAM"
        title="Meet the people behind your progress."
        description="Expert guidance, practical coaching, and the accountability to help you train safely and consistently."
      />
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={3}>
          {staticTrainers.map((trainer) => (
              <Grid
                key={trainer.id}
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{ display: "flex" }}
              >
                <Card sx={cardSx}>
                  <Avatar
                    src={trainer.imageUrl || trainer.image}
                    alt={trainer.name}
                    sx={avatarSx}
                  >
                    <FitnessCenter />
                  </Avatar>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Typography sx={{ fontSize: "1.5rem", fontWeight: 900 }}>
                      {trainer.name}
                    </Typography>
                    <Typography
                      sx={{ color: "#ff5961", fontWeight: 800, mt: 0.5 }}
                    >
                      {trainer.specialization || "Performance Coach"}
                    </Typography>
                    <Chip
                      icon={<WorkspacePremium />}
                      label={trainer.experience || "Experienced coach"}
                      size="small"
                      sx={chipSx}
                    />
                    <Typography
                      sx={{ color: "#999aa2", lineHeight: 1.75, mt: 2 }}
                    >
                      {trainer.bio ||
                        trainer.description ||
                        "Helping members move better, train smarter, and build lasting confidence."}
                    </Typography>
                    {trainer.certifications && (
                      <Typography
                        sx={{ color: "#d5d5da", fontSize: 13, mt: 2 }}
                      >
                        <strong>Certifications:</strong>{" "}
                        {trainer.certifications}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

const cardSx = {
  width: "100%",
  overflow: "hidden",
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
const avatarSx = {
  width: "100%",
  height: 270,
  borderRadius: 0,
  bgcolor: "#201014",
  color: "#e50914",
  fontSize: 48,
  objectFit: "cover",
  "& img": { objectFit: "cover" },
};
const chipSx = {
  mt: 2,
  color: "#ddd",
  borderColor: "rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.04)",
};
