import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Divider,
} from "@mui/material";

import {
  FitnessCenter,
  ArrowForward,
  CheckCircle,
  EmojiEvents,
  Groups,
  TrendingUp,
  AccessTime,
  Favorite,
  LocalFireDepartment,
  Star,
  Shield,
} from "@mui/icons-material";

export default function About() {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = [
    {
      icon: <Groups />,
      value: "1000+",
      label: "Active Members",
    },
    {
      icon: <EmojiEvents />,
      value: "15+",
      label: "Years Experience",
    },
    {
      icon: <FitnessCenter />,
      value: "50+",
      label: "Training Programs",
    },
    {
      icon: <Star />,
      value: "4.9/5",
      label: "Member Rating",
    },
  ];

  const features = [
    {
      icon: <FitnessCenter />,
      title: "Modern Equipment",
      text: "Train with quality equipment designed for strength, cardio, functional and performance training.",
    },
    {
      icon: <Groups />,
      title: "Expert Trainers",
      text: "Our experienced trainers help you train safely, consistently and effectively.",
    },
    {
      icon: <TrendingUp />,
      title: "Personal Progress",
      text: "Track your progress and build sustainable habits that keep you moving forward.",
    },
    {
      icon: <AccessTime />,
      title: "Flexible Hours",
      text: "Enjoy convenient gym hours so your fitness routine can fit around your lifestyle.",
    },
    {
      icon: <Favorite />,
      title: "Supportive Community",
      text: "Join a positive fitness community where members motivate and support each other.",
    },
    {
      icon: <Shield />,
      title: "Safe Environment",
      text: "We maintain a clean, welcoming and professional environment for every member.",
    },
  ];

  const values = [
    "Consistency over shortcuts",
    "Quality training over random workouts",
    "Progress over perfection",
    "Community over competition",
    "Health and strength for life",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#08090c",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* =========================================================
          HERO
      ========================================================= */}
      <Box
        sx={{
          minHeight: { xs: "650px", md: "760px" },
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",

          background: `
            linear-gradient(
              90deg,
              rgba(8,9,12,0.98) 0%,
              rgba(8,9,12,0.88) 45%,
              rgba(8,9,12,0.60) 100%
            ),
            radial-gradient(
              circle at 80% 45%,
              rgba(229,57,53,0.20),
              transparent 35%
            )
          `,
        }}
      >
        {/* Decorative glow */}
        <Box
          sx={{
            position: "absolute",
            width: 550,
            height: 550,
            borderRadius: "50%",
            background: "rgba(229,57,53,0.10)",
            filter: "blur(120px)",
            right: -180,
            top: 50,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.035,
            backgroundImage: `
              linear-gradient(#fff 1px, transparent 1px),
              linear-gradient(90deg, #fff 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ maxWidth: 700 }}>
                {/* Badge */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.8,
                    mb: 3,
                    borderRadius: 20,
                    border: "1px solid rgba(229,57,53,0.35)",
                    background: "rgba(229,57,53,0.08)",
                    color: "#ff625e",
                    fontSize: "0.78rem",
                    fontWeight: 900,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  <FitnessCenter sx={{ fontSize: 17 }} />
                  About MyGym
                </Box>

                <Typography
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: "2.8rem",
                      sm: "3.8rem",
                      md: "5.2rem",
                    },
                    fontWeight: 950,
                    lineHeight: 0.98,
                    letterSpacing: "-3px",
                    mb: 3,
                  }}
                >
                  Stronger
                  <Box
                    component="span"
                    sx={{
                      color: "#e53935",
                      display: "block",
                    }}
                  >
                    Every Day.
                  </Box>
                  Better For Life.
                </Typography>

                <Typography
                  sx={{
                    color: "#a0a0a7",
                    fontSize: {
                      xs: "1rem",
                      md: "1.12rem",
                    },
                    lineHeight: 1.8,
                    maxWidth: 620,
                    mb: 4,
                  }}
                >
                  MyGym is more than a place to work out. We are a community
                  built around strength, discipline, confidence and long-term
                  health. Our goal is to help every member become stronger
                  physically and mentally.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => goTo("/free-trial")}
                    startIcon={<FitnessCenter />}
                    endIcon={<ArrowForward />}
                    sx={primaryButton}
                  >
                    Start Your Journey
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => goTo("/programs")}
                    sx={secondaryButton}
                  >
                    Explore Programs
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* =========================================================
          STATS
      ========================================================= */}
      <Box
        sx={{
          py: { xs: 5, md: 6 },
          background: "#0d0e12",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {stats.map((stat) => (
              <Grid
                size={{
                  xs: 6,
                  sm: 3,
                }}
                key={stat.label}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    px: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mx: "auto",
                      mb: 1.5,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(229,57,53,0.10)",
                      border: "1px solid rgba(229,57,53,0.20)",
                      color: "#e53935",
                    }}
                  >
                    {stat.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "1.5rem",
                        md: "2rem",
                      },
                      fontWeight: 950,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#77777f",
                      mt: 0.8,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* =========================================================
          OUR STORY
      ========================================================= */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 5, md: 9 }}
          alignItems="center"
          sx={{
            py: { xs: 8, md: 13 },
          }}
        >
          {/* Visual */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                minHeight: {
                  xs: 420,
                  md: 560,
                },
                borderRadius: 5,
                overflow: "hidden",
                background: `
                  radial-gradient(
                    circle at 50% 35%,
                    rgba(229,57,53,0.25),
                    transparent 38%
                  ),
                  linear-gradient(
                    145deg,
                    #191a20,
                    #090a0d
                  )
                `,
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
              }}
            >
              {/* Large icon */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FitnessCenter
                  sx={{
                    fontSize: {
                      xs: 160,
                      md: 230,
                    },
                    color: "rgba(229,57,53,0.14)",
                  }}
                />
              </Box>

              {/* Accent */}
              <Box
                sx={{
                  position: "absolute",
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(229,57,53,0.16)",
                  filter: "blur(60px)",
                  top: 60,
                  right: 50,
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  left: 25,
                  right: 25,
                  bottom: 25,
                  p: 3,
                  borderRadius: 3,
                  background: "rgba(8,9,12,0.78)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography
                  sx={{
                    color: "#e53935",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    mb: 0.8,
                  }}
                >
                  Our Philosophy
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.1rem",
                      md: "1.35rem",
                    },
                    fontWeight: 900,
                    lineHeight: 1.4,
                  }}
                >
                  "Train with purpose. Live with strength."
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Text */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionLabel text="Our Story" />

            <Typography
              sx={{
                fontSize: {
                  xs: "2.2rem",
                  md: "3.3rem",
                },
                fontWeight: 950,
                lineHeight: 1.05,
                letterSpacing: "-1.5px",
                mb: 3,
              }}
            >
              More Than A
              <Box
                component="span"
                sx={{
                  color: "#e53935",
                  display: "block",
                }}
              >
                Gym
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#9999a1",
                lineHeight: 1.85,
                mb: 2.5,
              }}
            >
              We believe fitness should be accessible, motivating and
              sustainable. MyGym was created to provide a place where people of
              every fitness level can train, improve and feel confident.
            </Typography>

            <Typography
              sx={{
                color: "#9999a1",
                lineHeight: 1.85,
                mb: 3.5,
              }}
            >
              Whether your goal is building muscle, losing weight, improving
              endurance or simply becoming healthier, our programs and trainers
              are designed to help you make meaningful progress.
            </Typography>

            <Stack spacing={1.6}>
              {values.map((value) => (
                <Box
                  key={value}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.3,
                  }}
                >
                  <CheckCircle
                    sx={{
                      color: "#e53935",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#ddd",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* =========================================================
          WHY MYGYM
      ========================================================= */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "#0d0e12",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            textAlign="center"
            sx={{
              maxWidth: 720,
              mx: "auto",
              mb: 6,
            }}
          >
            <SectionLabel text="Why MyGym" centered />

            <Typography
              sx={{
                fontSize: {
                  xs: "2.2rem",
                  md: "3.2rem",
                },
                fontWeight: 950,
                lineHeight: 1.05,
                mb: 2,
              }}
            >
              Built To Help You
              <Box
                component="span"
                sx={{
                  color: "#e53935",
                  ml: 1,
                }}
              >
                Win
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#85858d",
                lineHeight: 1.8,
              }}
            >
              Everything we do is designed around one goal: helping you become
              stronger, healthier and more confident.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {features.map((feature) => (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
                key={feature.title}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 3,
                    background: "linear-gradient(145deg, #17181e, #101115)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.3s ease",

                    "&:hover": {
                      transform: "translateY(-7px)",
                      borderColor: "rgba(229,57,53,0.35)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      mb: 2.5,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(229,57,53,0.10)",
                      color: "#e53935",
                      border: "1px solid rgba(229,57,53,0.20)",
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "1.15rem",
                      fontWeight: 900,
                      mb: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#808089",
                      lineHeight: 1.75,
                      fontSize: "0.9rem",
                    }}
                  >
                    {feature.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* =========================================================
          MISSION / VISION
      ========================================================= */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          sx={{
            py: { xs: 8, md: 12 },
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard
              icon={<LocalFireDepartment />}
              label="Our Mission"
              title="Make Fitness A Lifestyle"
              text="Our mission is to create an environment where training becomes a natural part of everyday life. We help members build discipline, confidence and healthy habits that last."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard
              icon={<EmojiEvents />}
              label="Our Vision"
              title="A Stronger Community"
              text="We envision a fitness community where everyone feels welcome, motivated and empowered to reach their personal potential."
            />
          </Grid>
        </Grid>
      </Container>

      {/* =========================================================
          CTA
      ========================================================= */}
      <Box
        sx={{
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              p: {
                xs: 4,
                md: 7,
              },
              borderRadius: 5,
              textAlign: "center",
              background: `
                radial-gradient(
                  circle at 50% 0%,
                  rgba(229,57,53,0.25),
                  transparent 45%
                ),
                linear-gradient(
                  145deg,
                  #1b1c22,
                  #101115
                )
              `,
              border: "1px solid rgba(229,57,53,0.20)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.4)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 250,
                height: 250,
                borderRadius: "50%",
                background: "rgba(229,57,53,0.12)",
                filter: "blur(70px)",
                left: "50%",
                top: -150,
                transform: "translateX(-50%)",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#e53935",
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                Your Time Is Now
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "2.2rem",
                    md: "3.4rem",
                  },
                  fontWeight: 950,
                  lineHeight: 1.05,
                  mb: 2,
                }}
              >
                Ready To Become
                <Box
                  component="span"
                  sx={{
                    color: "#e53935",
                    ml: 1,
                  }}
                >
                  Stronger?
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "#92929a",
                  maxWidth: 620,
                  mx: "auto",
                  lineHeight: 1.8,
                  mb: 3.5,
                }}
              >
                Stop waiting for the perfect time. Start where you are, follow
                the process and let us help you build a stronger version of
                yourself.
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => goTo("/free-trial")}
                  startIcon={<FitnessCenter />}
                  endIcon={<ArrowForward />}
                  sx={primaryButton}
                >
                  Book Free Trial
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => goTo("/contact")}
                  sx={secondaryButton}
                >
                  Contact Us
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

/* ============================================================
   SECTION LABEL
============================================================ */

function SectionLabel({ text, centered = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: centered ? "center" : "flex-start",
        gap: 1,
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          width: 25,
          height: 3,
          borderRadius: 5,
          background: "#e53935",
        }}
      />

      <Typography
        sx={{
          color: "#e53935",
          fontSize: "0.75rem",
          fontWeight: 900,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({ icon, label, title, text }) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: {
          xs: 3,
          md: 4,
        },
        borderRadius: 4,
        background: "linear-gradient(145deg, #17181e, #0e0f13)",
        border: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-5px)",
          borderColor: "rgba(229,57,53,0.30)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 90,
          height: 3,
          background: "#e53935",
        }}
      />

      <Box
        sx={{
          width: 55,
          height: 55,
          mb: 2.5,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(229,57,53,0.10)",
          color: "#e53935",
          border: "1px solid rgba(229,57,53,0.20)",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: "#e53935",
          fontSize: "0.72rem",
          fontWeight: 900,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          mb: 0.7,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: "1.45rem",
          fontWeight: 900,
          mb: 1.3,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#85858d",
          lineHeight: 1.8,
          fontSize: "0.92rem",
        }}
      >
        {text}
      </Typography>
    </Paper>
  );
}

/* ============================================================
   BUTTON STYLES
============================================================ */

const primaryButton = {
  px: 3,
  py: 1.5,
  borderRadius: 2.5,
  fontWeight: 900,
  textTransform: "none",
  background: "linear-gradient(135deg, #e53935, #c62828)",
  boxShadow: "0 12px 30px rgba(229,57,53,0.25)",
  transition: "all 0.25s ease",

  "&:hover": {
    background: "linear-gradient(135deg, #f44336, #d32f2f)",
    transform: "translateY(-2px)",
    boxShadow: "0 16px 35px rgba(229,57,53,0.35)",
  },
};

const secondaryButton = {
  px: 3,
  py: 1.5,
  borderRadius: 2.5,
  fontWeight: 800,
  textTransform: "none",
  color: "#fff",
  borderColor: "rgba(255,255,255,0.20)",

  "&:hover": {
    borderColor: "#e53935",
    background: "rgba(229,57,53,0.08)",
  },
};
