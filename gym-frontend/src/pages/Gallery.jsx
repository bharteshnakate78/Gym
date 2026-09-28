import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
} from "@mui/material";
import { Close, OpenInFull } from "@mui/icons-material";
import PageIntro from "../components/PageIntro";
import { staticGallery } from "../data/staticContent";

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh", background: "#08080a", color: "#fff" }}>
      <PageIntro
        eyebrow="THE ATMOSPHERE"
        title="See where the work happens."
        description="A focused training environment, quality equipment, and the energy of a community that keeps showing up."
      />
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={2}>
          {staticGallery.map((item, index) => (
            <Grid
              key={item.id}
              size={{
                xs: 12,
                sm: index === 0 ? 8 : 4,
                md: index === 0 ? 6 : 3,
              }}
            >
              <Card onClick={() => setSelected(item)} sx={tileSx}>
                <CardMedia
                  component="img"
                  image={item.imageUrl}
                  alt={item.title}
                  sx={{
                    height: { xs: 240, md: index === 0 ? 420 : 280 },
                    objectFit: "cover",
                  }}
                />
                <Box className="gallery-caption">
                  <span>{item.title}</span>
                  <OpenInFull />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="lg"
      >
        <DialogContent
          sx={{ p: 0, background: "#08080a", position: "relative" }}
        >
          {selected && (
            <>
              <IconButton
                onClick={() => setSelected(null)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  zIndex: 2,
                  color: "#fff",
                  background: "rgba(0,0,0,.55)",
                }}
              >
                <Close />
              </IconButton>
              <Box
                component="img"
                src={selected.imageUrl}
                alt={selected.title || "Gym gallery"}
                sx={{
                  display: "block",
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                  objectFit: "contain",
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

const tileSx = {
  position: "relative",
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: 1,
  background: "#151519",
  "&:hover img": { transform: "scale(1.05)" },
  "&:hover .gallery-caption": { opacity: 1 },
};
