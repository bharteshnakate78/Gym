import { Box, Typography } from "@mui/material";
export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <Box textAlign="center" sx={{ mb: 5 }}>
      <Typography color="primary" fontWeight={900} letterSpacing={2}>
        {eyebrow}
      </Typography>
      <Typography variant="h3" fontWeight={900}>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
