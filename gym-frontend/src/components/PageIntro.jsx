import { Box, Container, Typography } from "@mui/material";

export default function PageIntro({ eyebrow, title, description }) {
  return (
    <Box
      sx={{
        py: { xs: 7, md: 11 },
        color: "#fff",
        background:
          "linear-gradient(120deg, #08080a 0%, #141419 55%, #260b0d 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{
            color: "#ff5a5f",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          {eyebrow}
        </Typography>
        <Typography
          component="h1"
          sx={{
            maxWidth: 760,
            fontSize: { xs: "2.7rem", md: "5rem" },
            fontWeight: 950,
            lineHeight: 0.98,
            letterSpacing: "-2px",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            maxWidth: 650,
            mt: 2.5,
            color: "#a6a6ad",
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.8,
          }}
        >
          {description}
        </Typography>
      </Container>
    </Box>
  );
}
