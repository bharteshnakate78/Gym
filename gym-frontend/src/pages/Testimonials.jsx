import {
  Avatar,
  Box,
  Card,
  CardContent,
  Rating,
  Typography,
} from "@mui/material";

import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

import CrudList from "../components/CrudList";

export default function Testimonials() {
  const fallbackTestimonials = [
    {
      id: 1,
      memberName: "Rahul",
      message:
        "The atmosphere completely changed the way I train. It feels more like a performance club than a normal gym.",
      rating: 5,
    },
    {
      id: 2,
      memberName: "Priya",
      message:
        "The trainers actually care about progress. My strength and confidence have improved massively.",
      rating: 5,
    },
    {
      id: 3,
      memberName: "Amit",
      message:
        "Clean, premium, motivating and professional. Easily one of the best fitness experiences I've had.",
      rating: 5,
    },
  ];

  return (
    <CrudList
      endpoint="/testimonials"
      title="What Our Members Say"
      render={(t) => {
        const name = t.memberName || "Gym Member";

        return (
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <FormatQuoteIcon
                color="primary"
                sx={{
                  fontSize: 40,
                  mb: 1,
                }}
              />

              <Rating value={Number(t.rating) || 0} precision={0.5} readOnly />

              <Typography
                sx={{
                  my: 3,
                  lineHeight: 1.8,
                  fontStyle: "italic",
                }}
              >
                "{t.message}"
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar>{name.charAt(0).toUpperCase()}</Avatar>

                <Box>
                  <Typography fontWeight={900}>{name}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    Gym Member
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <section className="premium-section dark-section reviews-section">
              <Container maxWidth="xl">
                <PremiumSectionHeader
                  eyebrow="MEMBER STORIES"
                  title="THEY CAME FOR THE"
                  highlight="CHANGE."
                  description="Real people. Real work. Real transformations."
                />

                <Grid container spacing={3}>
                  {visibleTestimonials.slice(0, 3).map((review, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={review.id || index}>
                      <Card className="review-card">
                        <Box className="review-top">
                          <Box className="quote-mark">“</Box>

                          <Rating
                            value={Number(review.rating || 5)}
                            readOnly
                            size="small"
                          />
                        </Box>

                        <Typography className="review-message">
                          {review.message ||
                            review.content ||
                            review.text ||
                            "An incredible training experience from day one."}
                        </Typography>

                        <Box className="review-person">
                          <Avatar className="review-avatar">
                            {(review.memberName || review.name || "M")
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar>

                          <Box>
                            <Typography className="review-name">
                              {review.memberName ||
                                review.name ||
                                "MyGym Member"}
                            </Typography>

                            <Typography className="review-label">
                              VERIFIED MEMBER
                            </Typography>
                          </Box>

                          <Check className="verified-check" />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </section>
          </Card>
        );
      }}
    />
  );
}
