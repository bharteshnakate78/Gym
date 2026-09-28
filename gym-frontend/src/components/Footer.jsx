import { useState } from "react";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Grid,
  Link,
  Button,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  ArrowUpward,
  FitnessCenter,
  ArrowForward,
  Send,
  CheckCircle,
} from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  /* =========================================================
     PROTECTED NAVIGATION
  ========================================================= */

  const handleProtectedNavigation = (path) => {
    if (!user) {
      navigate("/login", {
        state: {
          from: path,
        },
      });

      return;
    }

    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     NORMAL NAVIGATION
  ========================================================= */

  const handleNavigation = (path) => {
    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     SCROLL TO TOP
  ========================================================= */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     NEWSLETTER
  ========================================================= */

  const handleSubscribe = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return;
    }

    setNewsletterOpen(true);
    setEmail("");
  };

  /* =========================================================
     SOCIAL LINKS
  ========================================================= */

  const socialLinks = [
    {
      icon: <Facebook />,
      url: "https://facebook.com",
      color: "#1877F2",
      label: "Facebook",
    },
    {
      icon: <Instagram />,
      url: "https://instagram.com",
      color: "#E4405F",
      label: "Instagram",
    },
    {
      icon: <Twitter />,
      url: "https://twitter.com",
      color: "#1DA1F2",
      label: "Twitter",
    },
    {
      icon: <YouTube />,
      url: "https://youtube.com",
      color: "#FF0000",
      label: "YouTube",
    },
    {
      icon: <LinkedIn />,
      url: "https://linkedin.com",
      color: "#0A66C2",
      label: "LinkedIn",
    },
  ];

  /* =========================================================
     QUICK LINKS
  ========================================================= */

  const quickLinks = [
    ["Home", "/"],
    ["About", "/about"],
    ["Programs", "/programs"],
    ["Trainers", "/trainers"],
    ["Gallery", "/gallery"],
    ["Contact", "/contact"],
  ];

  /* =========================================================
     SERVICES
  ========================================================= */

  const services = [
    {
      title: "Personal Training",
      path: "/programs",
    },
    {
      title: "Weight Training",
      path: "/programs",
    },
    {
      title: "Cardio Training",
      path: "/programs",
    },
    {
      title: "Yoga & Fitness",
      path: "/programs",
    },
    {
      title: "Nutrition Plans",
      path: "/programs",
    },
  ];

  /* =========================================================
     SECTION TITLE
  ========================================================= */

  const sectionTitleSx = {
    mb: 2.7,
    position: "relative",
    display: "inline-block",
    color: "#ffffff",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      bottom: -9,
      width: 32,
      height: 3,
      borderRadius: 5,
      background: "linear-gradient(90deg, #e50914, #ff3943)",
    },
  };

  /* =========================================================
     CONTACT ITEM
  ========================================================= */

  const contactIconSx = {
    width: 40,
    height: 40,
    minWidth: 40,

    borderRadius: 1.5,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background: "rgba(229,9,20,0.09)",

    border: "1px solid rgba(229,9,20,0.18)",
  };

  /* =========================================================
     LINK STYLE
  ========================================================= */

  const footerLinkSx = {
    width: "fit-content",

    color: "#85858d",

    fontSize: "0.93rem",

    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",

    "&:hover": {
      color: "#e50914",
      transform: "translateX(7px)",
    },
  };

  /* =========================================================
     FOOTER
  ========================================================= */

  return (
    <>
      <Box
        component="footer"
        sx={{
          mt: 10,
          pt: 7,
          pb: 3,

          position: "relative",
          overflow: "hidden",

          background:
            "linear-gradient(180deg, #101012 0%, #080809 48%, #050506 100%)",

          borderTop: "1px solid rgba(255,255,255,0.08)",

          color: "#fff",

          "&::before": {
            content: '""',

            position: "absolute",

            top: 0,
            left: "8%",
            right: "8%",

            height: "1px",

            background:
              "linear-gradient(90deg, transparent, rgba(229,9,20,0.9), transparent)",
          },
        }}
      >
        {/* =====================================================
            LEFT GLOW
        ===================================================== */}

        <Box
          sx={{
            position: "absolute",

            top: -200,
            left: -180,

            width: 500,
            height: 500,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(229,9,20,0.15) 0%, rgba(229,9,20,0.05) 35%, transparent 70%)",

            filter: "blur(5px)",

            pointerEvents: "none",
          }}
        />

        {/* =====================================================
            RIGHT GLOW
        ===================================================== */}

        <Box
          sx={{
            position: "absolute",

            bottom: -250,
            right: -180,

            width: 550,
            height: 550,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(229,9,20,0.12) 0%, rgba(229,9,20,0.03) 38%, transparent 70%)",

            pointerEvents: "none",
          }}
        />

        {/* =====================================================
            GRID BACKGROUND
        ===================================================== */}

        <Box
          sx={{
            position: "absolute",
            inset: 0,

            opacity: 0.025,

            pointerEvents: "none",

            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",

            backgroundSize: "45px 45px",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* ===================================================
              PREMIUM CTA
          =================================================== */}

          <Box
            sx={{
              mb: 8,

              p: {
                xs: 3,
                sm: 4,
                md: 6,
              },

              borderRadius: 4,

              textAlign: "center",

              position: "relative",
              overflow: "hidden",

              background:
                "linear-gradient(135deg, rgba(32,32,37,0.97), rgba(14,14,17,0.99))",

              border: "1px solid rgba(255,255,255,0.08)",

              boxShadow:
                "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",

              backdropFilter: "blur(16px)",

              "&::before": {
                content: '""',

                position: "absolute",

                top: 0,
                left: 0,
                right: 0,

                height: 4,

                background:
                  "linear-gradient(90deg, transparent, #e50914, #ff4b54, #e50914, transparent)",
              },

              "&::after": {
                content: '""',

                position: "absolute",

                width: 350,
                height: 350,

                top: -220,
                right: -150,

                borderRadius: "50%",

                background:
                  "radial-gradient(circle, rgba(229,9,20,0.18), transparent 70%)",

                pointerEvents: "none",
              },
            }}
          >
            {/* CTA ICON */}

            <Box
              sx={{
                width: 66,
                height: 66,

                borderRadius: "50%",

                mx: "auto",
                mb: 2,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "linear-gradient(135deg, #e50914, #a7070f)",

                boxShadow: "0 15px 40px rgba(229,9,20,0.35)",

                position: "relative",
                zIndex: 2,
              }}
            >
              <FitnessCenter
                sx={{
                  fontSize: 31,
                }}
              />
            </Box>

            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.4rem",
                  md: "3rem",
                },

                letterSpacing: {
                  xs: 0.5,
                  md: 1.5,
                },

                position: "relative",
                zIndex: 2,
              }}
            >
              READY TO GET{" "}
              <Box
                component="span"
                sx={{
                  color: "#e50914",

                  textShadow: "0 0 30px rgba(229,9,20,0.3)",
                }}
              >
                STRONGER?
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                mb: 3.5,

                maxWidth: 650,
                mx: "auto",

                color: "#9999a3",

                lineHeight: 1.8,

                fontSize: {
                  xs: "0.9rem",
                  md: "1rem",
                },

                position: "relative",
                zIndex: 2,
              }}
            >
              Start your fitness journey today. Train with professional coaches,
              access premium facilities, and become the strongest version of
              yourself.
            </Typography>

            <Button
              onClick={() => handleProtectedNavigation("/memberships")}
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: {
                  xs: 3.5,
                  sm: 4.5,
                },

                py: 1.5,

                borderRadius: 2.5,

                fontWeight: 900,

                letterSpacing: 0.8,

                background: "linear-gradient(135deg, #e50914, #c30711)",

                boxShadow: "0 12px 35px rgba(229,9,20,0.3)",

                position: "relative",
                zIndex: 2,

                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",

                "&:hover": {
                  background: "linear-gradient(135deg, #ff1a25, #b80710)",

                  transform: "translateY(-4px)",

                  boxShadow: "0 18px 45px rgba(229,9,20,0.45)",

                  "& .MuiButton-endIcon": {
                    transform: "translateX(5px)",
                  },
                },

                "& .MuiButton-endIcon": {
                  transition: "transform 0.3s ease",
                },
              }}
            >
              JOIN NOW
            </Button>
          </Box>

          {/* ===================================================
              MAIN FOOTER
          =================================================== */}

          <Grid
            container
            spacing={{
              xs: 5,
              md: 6,
            }}
          >
            {/* =================================================
                BRAND
            ================================================= */}

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2.2}>
                {/* LOGO */}

                <Stack direction="row" alignItems="center" spacing={1.3}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,

                      borderRadius: 2,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      background: "linear-gradient(135deg, #e50914, #a7070f)",

                      boxShadow: "0 10px 30px rgba(229,9,20,0.28)",
                    }}
                  >
                    <FitnessCenter
                      sx={{
                        fontSize: 26,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{
                      letterSpacing: 1.5,
                      lineHeight: 1,
                    }}
                  >
                    FIT
                    <Box
                      component="span"
                      sx={{
                        color: "#e50914",
                      }}
                    >
                      NESS
                    </Box>
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    maxWidth: 390,

                    color: "#85858d",

                    lineHeight: 1.9,

                    fontSize: "0.95rem",
                  }}
                >
                  Train stronger. Live better. Transform your body, improve your
                  health, and build a stronger lifestyle with Fitness Club.
                </Typography>

                {/* SOCIAL */}

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {socialLinks.map((social) => (
                    <Tooltip key={social.label} title={social.label} arrow>
                      <IconButton
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        sx={{
                          width: 44,
                          height: 44,

                          color: "#85858d",

                          backgroundColor: "rgba(255,255,255,0.025)",

                          border: "1px solid rgba(255,255,255,0.08)",

                          transition: "all 0.35s cubic-bezier(.4,0,.2,1)",

                          "&:hover": {
                            color: "#fff",

                            backgroundColor: social.color,

                            borderColor: social.color,

                            transform: "translateY(-6px) scale(1.05)",

                            boxShadow: `0 12px 30px ${social.color}55`,
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* =================================================
                QUICK LINKS
            ================================================= */}

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="h6" fontWeight={900} sx={sectionTitleSx}>
                Quick Links
              </Typography>

              <Stack spacing={1.5}>
                {quickLinks.map(([title, path]) => (
                  <Link
                    key={title}
                    component={RouterLink}
                    to={path}
                    underline="none"
                    onClick={() => handleNavigation(path)}
                    sx={footerLinkSx}
                  >
                    {title}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* =================================================
                SERVICES
            ================================================= */}

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="h6" fontWeight={900} sx={sectionTitleSx}>
                Services
              </Typography>

              <Stack spacing={1.5}>
                {services.map((service) => (
                  <Link
                    key={service.title}
                    component={RouterLink}
                    to={service.path}
                    underline="none"
                    sx={footerLinkSx}
                  >
                    {service.title}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* =================================================
                CONTACT
            ================================================= */}

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={sectionTitleSx}>
                Contact Us
              </Typography>

              <Stack spacing={2.2}>
                {/* ADDRESS */}

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={contactIconSx}>
                    <LocationOn
                      sx={{
                        color: "#e50914",
                        fontSize: 20,
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      color: "#85858d",
                      lineHeight: 1.7,
                      fontSize: "0.93rem",
                    }}
                  >
                    123 Fitness Street,
                    <br />
                    Pune, Maharashtra, India
                  </Typography>
                </Stack>

                {/* PHONE */}

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={contactIconSx}>
                    <Phone
                      sx={{
                        color: "#e50914",
                        fontSize: 19,
                      }}
                    />
                  </Box>

                  <Link
                    href="tel:+919876543210"
                    underline="none"
                    sx={{
                      color: "#85858d",
                      fontSize: "0.93rem",

                      transition: "0.3s",

                      "&:hover": {
                        color: "#e50914",
                      },
                    }}
                  >
                    +91 98765 43210
                  </Link>
                </Stack>

                {/* EMAIL */}

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={contactIconSx}>
                    <Email
                      sx={{
                        color: "#e50914",
                        fontSize: 19,
                      }}
                    />
                  </Box>

                  <Link
                    href="mailto:support@fitnessclub.com"
                    underline="none"
                    sx={{
                      color: "#85858d",
                      fontSize: "0.93rem",

                      transition: "0.3s",

                      "&:hover": {
                        color: "#e50914",
                      },
                    }}
                  >
                    support@fitnessclub.com
                  </Link>
                </Stack>

                {/* HOURS */}

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={contactIconSx}>
                    <AccessTime
                      sx={{
                        color: "#e50914",
                        fontSize: 19,
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      color: "#85858d",
                      lineHeight: 1.7,
                      fontSize: "0.93rem",
                    }}
                  >
                    Mon - Sat: 6:00 AM - 10:00 PM
                    <br />
                    Sunday: 7:00 AM - 8:00 PM
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          {/* ===================================================
              NEWSLETTER
          =================================================== */}

          <Box
            sx={{
              mt: 7,

              p: {
                xs: 3,
                md: 4,
              },

              borderRadius: 3,

              background:
                "linear-gradient(135deg, rgba(25,25,29,0.98), rgba(12,12,15,0.98))",

              border: "1px solid rgba(255,255,255,0.07)",

              boxShadow: "0 20px 55px rgba(0,0,0,0.3)",

              position: "relative",
              overflow: "hidden",

              "&::before": {
                content: '""',

                position: "absolute",

                left: 0,
                top: 0,
                bottom: 0,

                width: 3,

                background: "linear-gradient(180deg, #e50914, transparent)",
              },
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,

                      borderRadius: 1.5,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      background: "rgba(229,9,20,0.1)",

                      border: "1px solid rgba(229,9,20,0.2)",
                    }}
                  >
                    <Send
                      sx={{
                        color: "#e50914",
                        fontSize: 20,
                      }}
                    />
                  </Box>

                  <Typography variant="h6" fontWeight={900}>
                    Stay Updated
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    mt: 1,

                    color: "#77777f",

                    lineHeight: 1.7,
                  }}
                >
                  Get fitness tips, workout plans, exclusive offers, and gym
                  updates directly in your inbox.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={1}
                >
                  <TextField
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubscribe();
                      }
                    }}
                    placeholder="Enter your email"
                    size="small"
                    type="email"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        minHeight: 48,

                        color: "#fff",

                        backgroundColor: "rgba(5,5,7,0.85)",

                        borderRadius: 1.5,

                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.09)",
                        },

                        "&:hover fieldset": {
                          borderColor: "rgba(229,9,20,0.5)",
                        },

                        "&.Mui-focused fieldset": {
                          borderColor: "#e50914",
                        },
                      },

                      "& input::placeholder": {
                        color: "#666",
                        opacity: 1,
                      },
                    }}
                  />

                  <Button
                    onClick={handleSubscribe}
                    variant="contained"
                    endIcon={<Send />}
                    sx={{
                      px: 3,

                      minWidth: 150,
                      minHeight: 48,

                      borderRadius: 1.5,

                      fontWeight: 900,

                      background: "linear-gradient(135deg, #e50914, #bd0710)",

                      "&:hover": {
                        background: "linear-gradient(135deg, #ff1a25, #a8070f)",

                        transform: "translateY(-2px)",
                      },

                      transition: "all 0.25s ease",
                    }}
                  >
                    SUBSCRIBE
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* ===================================================
              PREMIUM BOTTOM BAR
          =================================================== */}

          <Box
            sx={{
              mt: 4,
              pt: 3,

              borderTop: "1px solid rgba(255,255,255,0.07)",

              position: "relative",

              "&::before": {
                content: '""',

                position: "absolute",

                top: -1,
                left: "50%",

                transform: "translateX(-50%)",

                width: 100,
                height: 1,

                background:
                  "linear-gradient(90deg, transparent, #e50914, transparent)",

                boxShadow: "0 0 15px rgba(229,9,20,0.5)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                gap: 3,

                width: "100%",

                flexWrap: "nowrap",

                /* =========================================
                   TABLET
                ========================================= */

                "@media (max-width: 1100px)": {
                  gap: 1.5,
                },

                /* =========================================
                   MOBILE
                ========================================= */

                "@media (max-width: 850px)": {
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 2,
                },
              }}
            >
              {/* =================================================
                  COPYRIGHT + DESIGNED BY
              ================================================= */}

              <Typography
                sx={{
                  color: "#66666e",

                  fontSize: 13,

                  whiteSpace: "nowrap",

                  letterSpacing: 0.2,

                  flexShrink: 0,

                  "@media (max-width: 1100px)": {
                    fontSize: 12,
                  },

                  "@media (max-width: 850px)": {
                    whiteSpace: "normal",
                  },
                }}
              >
                © {currentYear} Fitness Club
                <Box
                  component="span"
                  sx={{
                    mx: 1,

                    color: "#38383e",
                  }}
                >
                  •
                </Box>
                All rights reserved.
                <Box
                  component="span"
                  sx={{
                    mx: 1,

                    color: "#38383e",
                  }}
                >
                  •
                </Box>
                Designed by{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#e50914",

                    fontWeight: 900,

                    textShadow: "0 0 12px rgba(229,9,20,0.2)",
                  }}
                >
                  Bhartesh Nakate
                </Box>
              </Typography>

              {/* =================================================
                  LEGAL LINKS
              ================================================= */}

              <Stack
                direction="row"
                alignItems="center"
                spacing={2.2}
                sx={{
                  whiteSpace: "nowrap",

                  flexShrink: 0,

                  "@media (max-width: 1100px)": {
                    spacing: 1.5,
                  },

                  "@media (max-width: 850px)": {
                    flexWrap: "wrap",
                    justifyContent: "center",
                    rowGap: 1,
                  },
                }}
              >
                <Link
                  component={RouterLink}
                  to="/privacy"
                  underline="none"
                  sx={{
                    color: "#66666e",

                    fontSize: 13,

                    transition: "all 0.3s ease",

                    "&:hover": {
                      color: "#e50914",
                    },
                  }}
                >
                  Privacy Policy
                </Link>

                <Box
                  sx={{
                    width: 3,
                    height: 3,

                    borderRadius: "50%",

                    background: "#e50914",

                    opacity: 0.7,
                  }}
                />

                <Link
                  component={RouterLink}
                  to="/terms"
                  underline="none"
                  sx={{
                    color: "#66666e",

                    fontSize: 13,

                    transition: "all 0.3s ease",

                    "&:hover": {
                      color: "#e50914",
                    },
                  }}
                >
                  Terms & Conditions
                </Link>

                <Box
                  sx={{
                    width: 3,
                    height: 3,

                    borderRadius: "50%",

                    background: "#e50914",

                    opacity: 0.7,
                  }}
                />

                <Link
                  component={RouterLink}
                  to="/contact"
                  underline="none"
                  sx={{
                    color: "#66666e",

                    fontSize: 13,

                    transition: "all 0.3s ease",

                    "&:hover": {
                      color: "#e50914",
                    },
                  }}
                >
                  Support
                </Link>
              </Stack>

              {/* =================================================
                  BACK TO TOP
              ================================================= */}

              <Tooltip title="Back to top" arrow>
                <IconButton
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                  sx={{
                    width: 40,
                    height: 40,

                    flexShrink: 0,

                    color: "#fff",

                    background: "linear-gradient(135deg, #e50914, #a7070f)",

                    border: "1px solid rgba(255,255,255,0.08)",

                    boxShadow: "0 8px 25px rgba(229,9,20,0.25)",

                    transition: "all 0.35s cubic-bezier(.4,0,.2,1)",

                    "&:hover": {
                      background: "linear-gradient(135deg, #ff1a25, #b80710)",

                      transform: "translateY(-4px)",

                      boxShadow: "0 14px 35px rgba(229,9,20,0.45)",
                    },
                  }}
                >
                  <ArrowUpward
                    sx={{
                      fontSize: 19,
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* =======================================================
          NEWSLETTER SUCCESS
      ======================================================= */}

      <Snackbar
        open={newsletterOpen}
        autoHideDuration={4000}
        onClose={() => setNewsletterOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setNewsletterOpen(false)}
          severity="success"
          icon={<CheckCircle />}
          sx={{
            background: "#151519",
            color: "#fff",

            border: "1px solid rgba(76,175,80,0.3)",

            "& .MuiAlert-icon": {
              color: "#4caf50",
            },
          }}
        >
          You're subscribed! Welcome to Fitness Club.
        </Alert>
      </Snackbar>
    </>
  );
}
// import {
//   Box,
//   Container,
//   Typography,
//   IconButton,
//   Stack,
//   Grid,
//   Divider,
//   Link,
//   Button,
//   TextField,
//   Tooltip,
// } from "@mui/material";

// import {
//   Facebook,
//   Instagram,
//   Twitter,
//   YouTube,
//   LinkedIn,
//   Phone,
//   Email,
//   LocationOn,
//   AccessTime,
//   ArrowUpward,
//   FitnessCenter,
//   ArrowForward,
//   Send,
// } from "@mui/icons-material";

// import { Link as RouterLink, useNavigate } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   const navigate = useNavigate();

//   const { user } = useAuth();

//   /* =========================================================
//      PROTECTED NAVIGATION
//   ========================================================= */

//   const handleProtectedNavigation = (path) => {
//     if (!user) {
//       navigate("/login", {
//         state: {
//           from: path,
//         },
//       });

//       return;
//     }

//     navigate(path);
//   };

//   /* =========================================================
//      NORMAL NAVIGATION
//   ========================================================= */

//   const handleNavigation = (path) => {
//     navigate(path);
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* =========================================================
//      SCROLL TO TOP
//   ========================================================= */

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* =========================================================
//      SOCIAL LINKS
//   ========================================================= */

//   const socialLinks = [
//     {
//       icon: <Facebook />,
//       url: "https://facebook.com",
//       color: "#1877F2",
//       label: "Facebook",
//     },
//     {
//       icon: <Instagram />,
//       url: "https://instagram.com",
//       color: "#E4405F",
//       label: "Instagram",
//     },
//     {
//       icon: <Twitter />,
//       url: "https://twitter.com",
//       color: "#1DA1F2",
//       label: "Twitter",
//     },
//     {
//       icon: <YouTube />,
//       url: "https://youtube.com",
//       color: "#FF0000",
//       label: "YouTube",
//     },
//     {
//       icon: <LinkedIn />,
//       url: "https://linkedin.com",
//       color: "#0A66C2",
//       label: "LinkedIn",
//     },
//   ];

//   /* =========================================================
//      QUICK LINKS
//   ========================================================= */

//   const quickLinks = [
//     ["Home", "/"],
//     ["About", "/about"],
//     ["Programs", "/programs"],
//     ["Trainers", "/trainers"],
//     ["Contact", "/contact"],
//   ];

//   /* =========================================================
//      SERVICES
//   ========================================================= */

//   const services = [
//     "Personal Training",
//     "Weight Training",
//     "Cardio Training",
//     "Yoga & Fitness",
//     "Nutrition Plans",
//   ];

//   return (
//     <Box
//       component="footer"
//       sx={{
//         mt: 10,
//         pt: 7,
//         pb: 3,
//         position: "relative",
//         overflow: "hidden",

//         background:
//           "linear-gradient(180deg, #101012 0%, #080809 45%, #050506 100%)",

//         borderTop: "1px solid rgba(255,255,255,0.08)",
//         color: "#fff",

//         /* =====================================================
//            PREMIUM BACKGROUND EFFECTS
//         ===================================================== */

//         "&::before": {
//           content: '""',
//           position: "absolute",
//           top: 0,
//           left: "10%",
//           right: "10%",
//           height: "1px",
//           background:
//             "linear-gradient(90deg, transparent, rgba(229,9,20,0.8), transparent)",
//         },
//       }}
//     >
//       {/* =====================================================
//           BACKGROUND GLOW - LEFT
//       ===================================================== */}

//       <Box
//         sx={{
//           position: "absolute",
//           top: -180,
//           left: -180,
//           width: 450,
//           height: 450,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle, rgba(229,9,20,0.13) 0%, rgba(229,9,20,0.04) 35%, transparent 70%)",
//           pointerEvents: "none",
//           filter: "blur(5px)",
//         }}
//       />

//       {/* =====================================================
//           BACKGROUND GLOW - RIGHT
//       ===================================================== */}

//       <Box
//         sx={{
//           position: "absolute",
//           bottom: -220,
//           right: -180,
//           width: 500,
//           height: 500,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle, rgba(229,9,20,0.11) 0%, rgba(229,9,20,0.03) 35%, transparent 70%)",
//           pointerEvents: "none",
//         }}
//       />

//       {/* =====================================================
//           DECORATIVE GRID
//       ===================================================== */}

//       <Box
//         sx={{
//           position: "absolute",
//           inset: 0,
//           opacity: 0.025,
//           pointerEvents: "none",

//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",

//           backgroundSize: "45px 45px",
//         }}
//       />

//       <Container
//         maxWidth="lg"
//         sx={{
//           position: "relative",
//           zIndex: 2,
//         }}
//       >
//         {/* ===================================================
//             PREMIUM CTA SECTION
//         =================================================== */}

//         <Box
//           sx={{
//             mb: 8,
//             p: {
//               xs: 3,
//               sm: 4,
//               md: 6,
//             },

//             borderRadius: 4,
//             textAlign: "center",
//             position: "relative",
//             overflow: "hidden",

//             background:
//               "linear-gradient(135deg, rgba(32,32,37,0.95), rgba(15,15,18,0.98))",

//             border: "1px solid rgba(255,255,255,0.08)",

//             boxShadow:
//               "0 25px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",

//             backdropFilter: "blur(12px)",

//             "&::before": {
//               content: '""',
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               height: 4,

//               background:
//                 "linear-gradient(90deg, transparent, #e50914, #ff3943, #e50914, transparent)",
//             },

//             "&::after": {
//               content: '""',
//               position: "absolute",
//               width: 300,
//               height: 300,
//               borderRadius: "50%",
//               top: -180,
//               right: -120,

//               background:
//                 "radial-gradient(circle, rgba(229,9,20,0.18), transparent 70%)",

//               pointerEvents: "none",
//             },
//           }}
//         >
//           {/* CTA ICON */}

//           <Box
//             sx={{
//               width: 62,
//               height: 62,
//               borderRadius: "50%",
//               margin: "0 auto 18px",

//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",

//               background: "linear-gradient(135deg, #e50914, #b20710)",

//               boxShadow: "0 12px 35px rgba(229,9,20,0.35)",

//               position: "relative",
//               zIndex: 2,
//             }}
//           >
//             <FitnessCenter sx={{ fontSize: 30 }} />
//           </Box>

//           <Typography
//             variant="h3"
//             fontWeight={900}
//             sx={{
//               fontSize: {
//                 xs: "1.8rem",
//                 sm: "2.3rem",
//                 md: "2.8rem",
//               },

//               letterSpacing: 1,
//               position: "relative",
//               zIndex: 2,
//             }}
//           >
//             READY TO GET{" "}
//             <Box
//               component="span"
//               sx={{
//                 color: "#e50914",
//                 textShadow: "0 0 25px rgba(229,9,20,0.25)",
//               }}
//             >
//               STRONGER?
//             </Box>
//           </Typography>

//           <Typography
//             sx={{
//               mt: 1.5,
//               mb: 3.5,
//               maxWidth: 650,
//               mx: "auto",

//               color: "#9d9da5",
//               lineHeight: 1.8,

//               position: "relative",
//               zIndex: 2,
//             }}
//           >
//             Start your fitness journey today. Join our community, train with
//             professional trainers, and become the strongest version of yourself.
//           </Typography>

//           <Button
//             onClick={() => handleProtectedNavigation("/memberships")}
//             variant="contained"
//             size="large"
//             endIcon={<ArrowForward />}
//             sx={{
//               px: 4.5,
//               py: 1.5,

//               borderRadius: 2.5,

//               fontWeight: 900,
//               letterSpacing: 0.7,

//               background: "linear-gradient(135deg, #e50914, #c30711)",

//               boxShadow: "0 10px 30px rgba(229,9,20,0.28)",

//               position: "relative",
//               zIndex: 2,

//               "&:hover": {
//                 background: "linear-gradient(135deg, #ff1a25, #b80710)",

//                 transform: "translateY(-4px)",

//                 boxShadow: "0 16px 40px rgba(229,9,20,0.4)",

//                 "& .MuiButton-endIcon": {
//                   transform: "translateX(4px)",
//                 },
//               },

//               transition: "all 0.3s ease",

//               "& .MuiButton-endIcon": {
//                 transition: "transform 0.3s ease",
//               },
//             }}
//           >
//             JOIN NOW
//           </Button>
//         </Box>

//         {/* ===================================================
//             MAIN FOOTER
//         =================================================== */}

//         <Grid container spacing={{ xs: 4, md: 6 }}>
//           {/* =================================================
//               BRAND
//           ================================================= */}

//           <Grid item xs={12} md={4}>
//             <Stack spacing={2.2}>
//               {/* LOGO */}

//               <Stack direction="row" alignItems="center" spacing={1.2}>
//                 <Box
//                   sx={{
//                     width: 48,
//                     height: 48,
//                     borderRadius: 2,

//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",

//                     background: "linear-gradient(135deg, #e50914, #a7070f)",

//                     boxShadow: "0 8px 25px rgba(229,9,20,0.25)",
//                   }}
//                 >
//                   <FitnessCenter sx={{ fontSize: 25 }} />
//                 </Box>

//                 <Typography
//                   variant="h4"
//                   fontWeight={900}
//                   sx={{
//                     letterSpacing: 1,
//                     lineHeight: 1,
//                   }}
//                 >
//                   FIT
//                   <Box
//                     component="span"
//                     sx={{
//                       color: "#e50914",
//                     }}
//                   >
//                     NESS
//                   </Box>
//                 </Typography>
//               </Stack>

//               <Typography
//                 sx={{
//                   maxWidth: 380,
//                   color: "#85858d",
//                   lineHeight: 1.85,
//                   fontSize: "0.95rem",
//                 }}
//               >
//                 Train stronger. Live better. Transform your body, improve your
//                 health, and build a stronger lifestyle with Fitness Club.
//               </Typography>

//               {/* SOCIAL MEDIA */}

//               <Stack
//                 direction="row"
//                 spacing={1}
//                 sx={{
//                   mt: 0.8,
//                 }}
//               >
//                 {socialLinks.map((social) => (
//                   <Tooltip key={social.label} title={social.label} arrow>
//                     <IconButton
//                       component="a"
//                       href={social.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       aria-label={social.label}
//                       sx={{
//                         width: 44,
//                         height: 44,

//                         color: "#888",
//                         backgroundColor: "rgba(255,255,255,0.025)",

//                         border: "1px solid rgba(255,255,255,0.08)",

//                         transition: "all 0.35s cubic-bezier(.4,0,.2,1)",

//                         "&:hover": {
//                           color: "#fff",
//                           backgroundColor: social.color,
//                           borderColor: social.color,

//                           transform: "translateY(-6px) scale(1.05)",

//                           boxShadow: `0 10px 28px ${social.color}55`,
//                         },
//                       }}
//                     >
//                       {social.icon}
//                     </IconButton>
//                   </Tooltip>
//                 ))}
//               </Stack>
//             </Stack>
//           </Grid>

//           {/* =================================================
//               QUICK LINKS
//           ================================================= */}

//           <Grid item xs={12} sm={6} md={2}>
//             <Typography
//               variant="h6"
//               fontWeight={900}
//               sx={{
//                 mb: 2.5,
//                 position: "relative",
//                 display: "inline-block",

//                 "&::after": {
//                   content: '""',
//                   position: "absolute",
//                   left: 0,
//                   bottom: -9,
//                   width: 30,
//                   height: 3,
//                   borderRadius: 5,
//                   backgroundColor: "#e50914",
//                 },
//               }}
//             >
//               Quick Links
//             </Typography>

//             <Stack spacing={1.5}>
//               {quickLinks.map(([title, path]) => (
//                 <Link
//                   key={title}
//                   component={RouterLink}
//                   to={path}
//                   underline="none"
//                   sx={{
//                     width: "fit-content",

//                     color: "#85858d",

//                     fontSize: "0.93rem",

//                     transition: "all 0.3s cubic-bezier(.4,0,.2,1)",

//                     "&:hover": {
//                       color: "#e50914",
//                       transform: "translateX(7px)",
//                     },
//                   }}
//                 >
//                   {title}
//                 </Link>
//               ))}
//             </Stack>
//           </Grid>

//           {/* =================================================
//               SERVICES
//           ================================================= */}

//           <Grid item xs={12} sm={6} md={2}>
//             <Typography
//               variant="h6"
//               fontWeight={900}
//               sx={{
//                 mb: 2.5,
//                 position: "relative",
//                 display: "inline-block",

//                 "&::after": {
//                   content: '""',
//                   position: "absolute",
//                   left: 0,
//                   bottom: -9,
//                   width: 30,
//                   height: 3,
//                   borderRadius: 5,
//                   backgroundColor: "#e50914",
//                 },
//               }}
//             >
//               Services
//             </Typography>

//             <Stack spacing={1.5}>
//               {services.map((service) => (
//                 <Typography
//                   key={service}
//                   sx={{
//                     color: "#85858d",
//                     fontSize: "0.93rem",

//                     cursor: "pointer",

//                     transition: "all 0.3s cubic-bezier(.4,0,.2,1)",

//                     "&:hover": {
//                       color: "#e50914",
//                       transform: "translateX(7px)",
//                     },
//                   }}
//                 >
//                   {service}
//                 </Typography>
//               ))}
//             </Stack>
//           </Grid>

//           {/* =================================================
//               CONTACT
//           ================================================= */}

//           <Grid item xs={12} md={4}>
//             <Typography
//               variant="h6"
//               fontWeight={900}
//               sx={{
//                 mb: 2.5,
//                 position: "relative",
//                 display: "inline-block",

//                 "&::after": {
//                   content: '""',
//                   position: "absolute",
//                   left: 0,
//                   bottom: -9,
//                   width: 30,
//                   height: 3,
//                   borderRadius: 5,
//                   backgroundColor: "#e50914",
//                 },
//               }}
//             >
//               Contact Us
//             </Typography>

//             <Stack spacing={2.2}>
//               {/* ADDRESS */}

//               <Stack direction="row" spacing={1.5} alignItems="flex-start">
//                 <Box
//                   sx={{
//                     width: 38,
//                     height: 38,
//                     minWidth: 38,

//                     borderRadius: 1.5,

//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",

//                     background: "rgba(229,9,20,0.09)",

//                     border: "1px solid rgba(229,9,20,0.18)",
//                   }}
//                 >
//                   <LocationOn
//                     sx={{
//                       color: "#e50914",
//                       fontSize: 20,
//                     }}
//                   />
//                 </Box>

//                 <Typography
//                   sx={{
//                     color: "#85858d",
//                     lineHeight: 1.7,
//                     fontSize: "0.93rem",
//                   }}
//                 >
//                   123 Fitness Street,
//                   <br />
//                   Pune, Maharashtra, India
//                 </Typography>
//               </Stack>

//               {/* PHONE */}

//               <Stack direction="row" spacing={1.5} alignItems="center">
//                 <Box
//                   sx={{
//                     width: 38,
//                     height: 38,
//                     minWidth: 38,

//                     borderRadius: 1.5,

//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",

//                     background: "rgba(229,9,20,0.09)",

//                     border: "1px solid rgba(229,9,20,0.18)",
//                   }}
//                 >
//                   <Phone
//                     sx={{
//                       color: "#e50914",
//                       fontSize: 19,
//                     }}
//                   />
//                 </Box>

//                 <Link
//                   href="tel:+919876543210"
//                   underline="none"
//                   sx={{
//                     color: "#85858d",
//                     fontSize: "0.93rem",

//                     transition: "0.3s",

//                     "&:hover": {
//                       color: "#e50914",
//                     },
//                   }}
//                 >
//                   +91 98765 43210
//                 </Link>
//               </Stack>

//               {/* EMAIL */}

//               <Stack direction="row" spacing={1.5} alignItems="center">
//                 <Box
//                   sx={{
//                     width: 38,
//                     height: 38,
//                     minWidth: 38,

//                     borderRadius: 1.5,

//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",

//                     background: "rgba(229,9,20,0.09)",

//                     border: "1px solid rgba(229,9,20,0.18)",
//                   }}
//                 >
//                   <Email
//                     sx={{
//                       color: "#e50914",
//                       fontSize: 19,
//                     }}
//                   />
//                 </Box>

//                 <Link
//                   href="mailto:support@fitnessclub.com"
//                   underline="none"
//                   sx={{
//                     color: "#85858d",
//                     fontSize: "0.93rem",

//                     transition: "0.3s",

//                     "&:hover": {
//                       color: "#e50914",
//                     },
//                   }}
//                 >
//                   support@fitnessclub.com
//                 </Link>
//               </Stack>

//               {/* HOURS */}

//               <Stack direction="row" spacing={1.5} alignItems="flex-start">
//                 <Box
//                   sx={{
//                     width: 38,
//                     height: 38,
//                     minWidth: 38,

//                     borderRadius: 1.5,

//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",

//                     background: "rgba(229,9,20,0.09)",

//                     border: "1px solid rgba(229,9,20,0.18)",
//                   }}
//                 >
//                   <AccessTime
//                     sx={{
//                       color: "#e50914",
//                       fontSize: 19,
//                     }}
//                   />
//                 </Box>

//                 <Typography
//                   sx={{
//                     color: "#85858d",
//                     lineHeight: 1.7,
//                     fontSize: "0.93rem",
//                   }}
//                 >
//                   Mon - Sat: 6:00 AM - 10:00 PM
//                   <br />
//                   Sunday: 7:00 AM - 8:00 PM
//                 </Typography>
//               </Stack>
//             </Stack>
//           </Grid>
//         </Grid>

//         {/* ===================================================
//             NEWSLETTER
//         =================================================== */}

//         <Box
//           sx={{
//             mt: 7,
//             p: {
//               xs: 3,
//               md: 4,
//             },

//             borderRadius: 3,

//             background:
//               "linear-gradient(135deg, rgba(24,24,28,0.95), rgba(13,13,16,0.95))",

//             border: "1px solid rgba(255,255,255,0.07)",

//             boxShadow: "0 15px 45px rgba(0,0,0,0.25)",
//           }}
//         >
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Stack direction="row" spacing={1.5} alignItems="center">
//                 <Box
//                   sx={{
//                     width: 42,
//                     height: 42,
//                     borderRadius: 1.5,

//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",

//                     background: "rgba(229,9,20,0.1)",

//                     border: "1px solid rgba(229,9,20,0.2)",
//                   }}
//                 >
//                   <Send
//                     sx={{
//                       color: "#e50914",
//                       fontSize: 20,
//                     }}
//                   />
//                 </Box>

//                 <Typography variant="h6" fontWeight={900}>
//                   Stay Updated
//                 </Typography>
//               </Stack>

//               <Typography
//                 sx={{
//                   mt: 1,
//                   color: "#77777f",
//                   lineHeight: 1.7,
//                 }}
//               >
//                 Get fitness tips, workout plans, offers, and gym updates
//                 directly in your inbox.
//               </Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Stack
//                 direction={{
//                   xs: "column",
//                   sm: "row",
//                 }}
//                 spacing={1}
//               >
//                 <TextField
//                   fullWidth
//                   placeholder="Enter your email"
//                   size="small"
//                   type="email"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       minHeight: 46,

//                       color: "#fff",

//                       backgroundColor: "rgba(5,5,7,0.85)",

//                       borderRadius: 1.5,

//                       "& fieldset": {
//                         borderColor: "rgba(255,255,255,0.09)",
//                       },

//                       "&:hover fieldset": {
//                         borderColor: "rgba(229,9,20,0.5)",
//                       },

//                       "&.Mui-focused fieldset": {
//                         borderColor: "#e50914",
//                       },
//                     },

//                     "& input::placeholder": {
//                       color: "#666",
//                       opacity: 1,
//                     },
//                   }}
//                 />

//                 <Button
//                   variant="contained"
//                   endIcon={<Send />}
//                   sx={{
//                     px: 3,
//                     minWidth: 145,
//                     minHeight: 46,

//                     borderRadius: 1.5,

//                     fontWeight: 900,

//                     background: "linear-gradient(135deg, #e50914, #bd0710)",

//                     "&:hover": {
//                       background: "linear-gradient(135deg, #ff1a25, #a8070f)",

//                       transform: "translateY(-2px)",
//                     },

//                     transition: "all 0.25s ease",
//                   }}
//                 >
//                   SUBSCRIBE
//                 </Button>
//               </Stack>
//             </Grid>
//           </Grid>
//         </Box>

//         {/* ===================================================
//             DIVIDER
//         =================================================== */}

//         <Divider
//           sx={{
//             my: 4,

//             borderColor: "rgba(255,255,255,0.07)",
//           }}
//         />

//         {/* ===================================================
//             BOTTOM FOOTER
//         =================================================== */}

//         <Stack
//           direction={{
//             xs: "column",
//             md: "row",
//           }}
//           justifyContent="space-between"
//           alignItems="center"
//           spacing={2.5}
//           sx={{
//             width: "100%",
//           }}
//         >
//           {/* COPYRIGHT */}

//           <Typography
//             sx={{
//               color: "#65656d",
//               fontSize: 13.5,
//               textAlign: {
//                 xs: "center",
//                 md: "left",
//               },
//             }}
//           >
//             © {currentYear} Fitness Club. All rights reserved.
//             <Box
//               component="span"
//               sx={{
//                 mx: 1,
//                 color: "#3e3e44",
//               }}
//             >
//               |
//             </Box>
//             Designed by{" "}
//             <Box
//               component="span"
//               sx={{
//                 color: "#e50914",
//                 fontWeight: 900,
//               }}
//             >
//               Bhartesh Nakate
//             </Box>
//           </Typography>

//           {/* FOOTER LINKS */}

//           <Stack
//             direction="row"
//             spacing={{
//               xs: 1.5,
//               sm: 3,
//             }}
//             sx={{
//               flexWrap: "wrap",
//               justifyContent: "center",
//               alignItems: "center",
//               rowGap: 1,
//             }}
//           >
//             <Link
//               component={RouterLink}
//               to="/privacy"
//               underline="none"
//               sx={{
//                 color: "#66666e",
//                 fontSize: 13.5,
//                 transition: "0.3s",

//                 "&:hover": {
//                   color: "#e50914",
//                 },
//               }}
//             >
//               Privacy Policy
//             </Link>

//             <Link
//               component={RouterLink}
//               to="/terms"
//               underline="none"
//               sx={{
//                 color: "#66666e",
//                 fontSize: 13.5,
//                 transition: "0.3s",

//                 "&:hover": {
//                   color: "#e50914",
//                 },
//               }}
//             >
//               Terms & Conditions
//             </Link>

//             <Link
//               component={RouterLink}
//               to="/contact"
//               underline="none"
//               sx={{
//                 color: "#66666e",
//                 fontSize: 13.5,
//                 transition: "0.3s",

//                 "&:hover": {
//                   color: "#e50914",
//                 },
//               }}
//             >
//               Support
//             </Link>
//           </Stack>

//           {/* SCROLL TO TOP */}

//           <Tooltip title="Back to top" arrow>
//             <IconButton
//               onClick={scrollToTop}
//               aria-label="Scroll to top"
//               sx={{
//                 width: 42,
//                 height: 42,

//                 color: "#fff",

//                 background: "linear-gradient(135deg, #e50914, #b80710)",

//                 border: "1px solid rgba(255,255,255,0.08)",

//                 boxShadow: "0 8px 22px rgba(229,9,20,0.25)",

//                 transition: "all 0.3s cubic-bezier(.4,0,.2,1)",

//                 "&:hover": {
//                   background: "linear-gradient(135deg, #ff1a25, #a8070f)",

//                   transform: "translateY(-5px)",

//                   boxShadow: "0 14px 30px rgba(229,9,20,0.38)",
//                 },
//               }}
//             >
//               <ArrowUpward />
//             </IconButton>
//           </Tooltip>
//         </Stack>
//       </Container>
//     </Box>
//   );
// }
