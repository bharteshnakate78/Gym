import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  ArrowOutward,
  Check,
  CheckCircle,
  DirectionsRun,
  FitnessCenter,
  Groups,
  LocalFireDepartment,
  PlayArrow,
  Restaurant,
  SelfImprovement,
  Shield,
  Star,
  TrendingUp,
  WorkspacePremium,
  Bolt,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  staticGallery,
  staticMemberships,
  staticPrograms,
  staticTrainers,
} from "../data/staticContent";

import "./Home.css";

/* =========================================================
   FALLBACK DATA
   ========================================================= */

const fallbackPrograms = [
  {
    id: "fallback-1",
    name: "Muscle Building",
    description:
      "Build serious strength, lean muscle and a powerful athletic physique.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-2",
    name: "Fat Loss",
    description:
      "High-intensity training designed to burn fat and reveal your strongest body.",
    imageUrl:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-3",
    name: "Yoga & Mobility",
    description:
      "Improve mobility, flexibility, balance and recovery with expert guidance.",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85",
  },
];

const fallbackGallery = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=85",
  },
];

const fallbackTrainers = [
  {
    id: 1,
    name: "Alex Carter",
    specialization: "Strength & Conditioning",
    imageUrl:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Marcus Stone",
    specialization: "Performance Training",
    imageUrl:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Sophia James",
    specialization: "Mobility & Wellness",
    imageUrl:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=85",
  },
];

const fallbackMemberships = [
  {
    id: 1,
    name: "Essential",
    description: "Everything you need to start your transformation.",
    price: 1499,
    features: [
      "Full gym access",
      "Locker access",
      "Basic fitness assessment",
      "Group classes",
    ],
  },
  {
    id: 2,
    name: "Elite",
    description: "Our most complete performance membership.",
    price: 2499,
    features: [
      "Unlimited gym access",
      "All group classes",
      "Personal training session",
      "Nutrition guidance",
      "Priority support",
    ],
  },
  {
    id: 3,
    name: "Performance",
    description: "For athletes who demand more from every session.",
    price: 3999,
    features: [
      "Everything in Elite",
      "Advanced performance testing",
      "Weekly coaching",
      "Custom workout plan",
    ],
  },
];

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

/* =========================================================
   HELPERS
   ========================================================= */

const getImage = (item) =>
  item?.imageUrl ||
  item?.imageURL ||
  item?.image ||
  item?.photoUrl ||
  item?.photo ||
  "";

const getMembershipPrice = (plan) => plan?.monthlyFee ?? plan?.price ?? 0;

const getMembershipFeatures = (plan, fallback = []) => {
  const benefits = plan?.benefits ?? plan?.features;

  if (Array.isArray(benefits)) {
    return benefits;
  }

  if (typeof benefits === "string") {
    return benefits
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
};

const getProgramIcon = (name = "") => {
  const value = name.toLowerCase();

  if (
    value.includes("fat") ||
    value.includes("loss") ||
    value.includes("cardio")
  ) {
    return <LocalFireDepartment />;
  }

  if (value.includes("yoga") || value.includes("mobility")) {
    return <SelfImprovement />;
  }

  if (
    value.includes("run") ||
    value.includes("fitness") ||
    value.includes("conditioning")
  ) {
    return <DirectionsRun />;
  }

  return <FitnessCenter />;
};

/* =========================================================
   SECTION HEADER
   ========================================================= */

function PremiumSectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  light = false,
}) {
  return (
    <Box className={`premium-section-header ${light ? "light" : ""}`}>
      <Box className="section-eyebrow">
        <span />
        {eyebrow}
      </Box>

      <Typography className="section-heading">
        {title} {highlight && <span className="heading-red">{highlight}</span>}
      </Typography>

      {description && (
        <Typography className="section-description">{description}</Typography>
      )}
    </Box>
  );
}

/* =========================================================
   HOME
   ========================================================= */

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     PROTECTED NAVIGATION
     ======================================================= */

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
  };

  /* =======================================================
     API
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([api.get("/testimonials")]);

        if (!mounted) return;

        const [testimonialsResponse] = results;

        if (testimonialsResponse.status === "fulfilled") {
          const data = Array.isArray(testimonialsResponse.value?.data)
            ? testimonialsResponse.value.data
            : [];

          setTestimonials(data);
        }

        const failed = results.some((result) => result.status === "rejected");

        if (failed) {
          setError(
            "Some live content could not be loaded. Showing available content.",
          );
        }
      } catch (err) {
        console.error("Home API error:", err);
        setError("Unable to load live fitness data.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     DATA WITH FALLBACKS
     ======================================================= */

  const visiblePrograms = staticPrograms;
  const visibleGallery = staticGallery;
  const visibleMemberships = staticMemberships;
  const visibleTrainers = staticTrainers;

  const visibleTestimonials = useMemo(
    () => (testimonials.length ? testimonials : fallbackTestimonials),
    [testimonials],
  );

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <Box className="home-loading">
        <Box className="loading-ring">
          <CircularProgress />
        </Box>

        <Typography className="loading-title">
          PREPARING YOUR
          <span> EXPERIENCE</span>
        </Typography>

        <Typography className="loading-subtitle">
          Loading the performance club...
        </Typography>
      </Box>
    );
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <Box className="home-page">
      {/* ===================================================
          HERO
          =================================================== */}

      <section className="luxury-hero">
        <div className="hero-image" />
        <div className="hero-black-gradient" />
        <div className="hero-red-glow" />
        <div className="hero-grid" />

        <Container maxWidth="xl" className="hero-container">
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box className="hero-copy">
                <Box className="hero-eyebrow">
                  <span className="live-dot" />
                  THE PERFORMANCE CLUB
                </Box>

                <Typography className="hero-title">
                  BUILD
                  <br />
                  YOUR
                  <br />
                  <span>STRONGEST</span>
                  <br />
                  SELF.
                </Typography>

                <Typography className="hero-text">
                  Premium training. Elite coaching. Relentless discipline.
                  Everything you need to become stronger, faster and better than
                  yesterday.
                </Typography>

                <Stack direction="row" spacing={2} className="hero-buttons">
                  <Button
                    variant="contained"
                    onClick={() => handleProtectedNavigation("/free-trial")}
                    endIcon={<ArrowForward />}
                  >
                    Start Your Journey
                  </Button>

                  <Button
                    className="hero-watch-button"
                    variant="outlined"
                    onClick={() => navigate("/about")}
                    startIcon={
                      <span className="play-circle">
                        <PlayArrow />
                      </span>
                    }
                  >
                    Explore The Club
                  </Button>
                </Stack>

                <Box className="hero-members">
                  <Box className="avatar-stack">
                    <Avatar src="https://i.pravatar.cc/80?img=12" />
                    <Avatar src="https://i.pravatar.cc/80?img=32" />
                    <Avatar src="https://i.pravatar.cc/80?img=45" />
                    <Avatar src="https://i.pravatar.cc/80?img=52" />
                  </Box>

                  <Box>
                    <Box className="hero-stars">
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                    </Box>

                    <Typography>
                      Trusted by <strong>5,000+</strong> members
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* HERO FLOATING STATS */}

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box className="hero-stats">
                <Box className="hero-stat-card hero-stat-main">
                  <Typography className="stat-number">10+</Typography>
                  <Typography className="stat-label">
                    YEARS OF
                    <br />
                    EXCELLENCE
                  </Typography>
                  <WorkspacePremium className="stat-icon" />
                </Box>

                <Box className="hero-stat-card">
                  <Typography className="stat-number">5K+</Typography>
                  <Typography className="stat-label">
                    MEMBERS
                    <br />
                    TRANSFORMED
                  </Typography>
                  <TrendingUp className="stat-icon" />
                </Box>

                <Box className="hero-stat-card">
                  <Typography className="stat-number">50+</Typography>
                  <Typography className="stat-label">
                    EXPERT
                    <br />
                    TRAINERS
                  </Typography>
                  <Groups className="stat-icon" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Box className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <Box className="scroll-line" />
        </Box>
      </section>

      {/* ===================================================
          MARQUEE
          =================================================== */}

      <section className="luxury-marquee">
        <div className="marquee-track">
          <span>STRENGTH</span>
          <b>✦</b>
          <span>DISCIPLINE</span>
          <b>✦</b>
          <span>PERFORMANCE</span>
          <b>✦</b>
          <span>RECOVERY</span>
          <b>✦</b>
          <span>RESULTS</span>
          <b>✦</b>

          <span>STRENGTH</span>
          <b>✦</b>
          <span>DISCIPLINE</span>
          <b>✦</b>
          <span>PERFORMANCE</span>
          <b>✦</b>
        </div>
      </section>

      {/* ===================================================
          WHY US
          =================================================== */}

      <section className="premium-section why-section">
        <Container maxWidth="xl">
          <PremiumSectionHeader
            eyebrow="WHY MYGYM"
            title="NOT JUST A"
            highlight="GYM."
            description="A performance-driven environment built for people who refuse to settle for average."
          />

          <Grid container spacing={3} className="why-grid">
            <Grid size={{ xs: 12, md: 4 }}>
              <Card className="luxury-feature-card">
                <Box className="feature-number">01</Box>

                <Box className="feature-icon">
                  <FitnessCenter />
                </Box>

                <Typography className="feature-title">
                  Elite Equipment
                </Typography>

                <Typography className="feature-text">
                  Train with premium strength, cardio and functional equipment
                  designed for serious progression.
                </Typography>

                <Box className="feature-arrow">
                  <ArrowOutward />
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card className="luxury-feature-card active">
                <Box className="feature-number">02</Box>

                <Box className="feature-icon">
                  <Bolt />
                </Box>

                <Typography className="feature-title">
                  Expert Coaching
                </Typography>

                <Typography className="feature-text">
                  Work with experienced coaches who understand training,
                  movement, recovery and real-world results.
                </Typography>

                <Box className="feature-arrow">
                  <ArrowOutward />
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card className="luxury-feature-card">
                <Box className="feature-number">03</Box>

                <Box className="feature-icon">
                  <Shield />
                </Box>

                <Typography className="feature-title">
                  Premium Environment
                </Typography>

                <Typography className="feature-text">
                  A focused, clean and high-energy environment where every
                  detail is designed around your experience.
                </Typography>

                <Box className="feature-arrow">
                  <ArrowOutward />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* ===================================================
          PROGRAMS
          =================================================== */}

      <section className="premium-section dark-section programs-section">
        <Container maxWidth="xl">
          <Box className="section-top-row">
            <PremiumSectionHeader
              eyebrow="TRAIN WITH PURPOSE"
              title="CHOOSE YOUR"
              highlight="MISSION."
              description="Structured programs designed around different goals, abilities and ambitions."
            />

            <Button
              className="desktop-view-button"
              onClick={() => navigate("/programs")}
              endIcon={<ArrowOutward />}
            >
              View All Programs
            </Button>
          </Box>

          <Grid container spacing={3}>
            {visiblePrograms.slice(0, 3).map((program, index) => {
              const image = getImage(program);

              return (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={program.id || index}>
                  <Card className="mission-card">
                    <Box className="mission-image">
                      <CardMedia
                        component="img"
                        image={image || fallbackPrograms[index]?.imageUrl}
                        alt={program.name}
                      />

                      <Box className="mission-overlay" />

                      <Box className="mission-index">0{index + 1}</Box>

                      <Box className="mission-icon">
                        {getProgramIcon(program.name)}
                      </Box>

                      <Box className="mission-bottom">
                        <Typography className="mission-name">
                          {program.name}
                        </Typography>

                        <Box className="mission-arrow">
                          <ArrowOutward />
                        </Box>
                      </Box>
                    </Box>

                    <CardContent className="mission-content">
                      <Typography>
                        {program.description ||
                          "Build strength, confidence and performance with a structured training approach."}
                      </Typography>

                      <Button
                        onClick={() => navigate("/programs")}
                        endIcon={<ArrowForward />}
                      >
                        Explore Program
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </section>

      {/* ===================================================
          BIG STATEMENT
          =================================================== */}

      <section className="statement-section">
        <div className="statement-bg" />

        <Container maxWidth="xl">
          <Box className="statement-content">
            <Typography className="statement-small">
              YOUR EXCUSES DON'T TRAIN.
            </Typography>

            <Typography className="statement-title">
              YOUR
              <br />
              <span>DISCIPLINE</span>
              <br />
              DOES.
            </Typography>

            <Typography className="statement-description">
              Progress doesn't come from motivation alone. It comes from showing
              up when motivation disappears.
            </Typography>

            <Button
              onClick={() => handleProtectedNavigation("/free-trial")}
              endIcon={<ArrowForward />}
            >
              Book A Free Trial
            </Button>
          </Box>
        </Container>
      </section>

      {/* ===================================================
          MEMBERSHIP
          =================================================== */}

      <section className="premium-section membership-section">
        <Container maxWidth="xl">
          <PremiumSectionHeader
            eyebrow="MEMBERSHIP"
            title="INVEST IN YOUR"
            highlight="STRONGEST SELF."
            description="Choose the level of access and support that matches your ambition."
          />

          <Grid container spacing={3} alignItems="stretch">
            {visibleMemberships.slice(0, 3).map((plan, index) => {
              const finalFeatures = getMembershipFeatures(
                plan,
                fallbackMemberships[index]?.features || [],
              );

              const isPopular = index === 1;

              return (
                <Grid size={{ xs: 12, md: 4 }} key={plan.id || index}>
                  <Card
                    className={`membership-luxury-card ${
                      isPopular ? "featured-membership" : ""
                    }`}
                  >
                    {isPopular && (
                      <Box className="elite-badge">MOST POPULAR</Box>
                    )}

                    <Box className="membership-top">
                      <Typography className="membership-number">
                        0{index + 1}
                      </Typography>

                      {isPopular && (
                        <WorkspacePremium className="membership-crown" />
                      )}
                    </Box>

                    <Typography className="membership-name">
                      {plan.name}
                    </Typography>

                    <Typography className="membership-description">
                      {plan.description ||
                        "Premium access designed to keep you progressing."}
                    </Typography>

                    <Box className="membership-price">
                      <span>₹</span>
                      {Number(getMembershipPrice(plan)).toLocaleString("en-IN")}
                      <small>/MONTH</small>
                    </Box>

                    <Box className="membership-divider" />

                    <Box className="membership-features">
                      {finalFeatures.map((feature, featureIndex) => (
                        <Box className="membership-feature" key={featureIndex}>
                          <CheckCircle />
                          <Typography>{feature}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      className="membership-button"
                      variant={isPopular ? "contained" : "outlined"}
                      onClick={() => navigate("/memberships")}
                      endIcon={<ArrowForward />}
                    >
                      Choose {plan.name}
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box className="membership-bottom-link">
            <Button
              onClick={() => navigate("/memberships")}
              endIcon={<ArrowOutward />}
            >
              Compare All Memberships
            </Button>
          </Box>
        </Container>
      </section>

      {/* ===================================================
          GALLERY
          =================================================== */}

      <section className="premium-section dark-section gallery-section">
        <Container maxWidth="xl">
          <Box className="section-top-row">
            <PremiumSectionHeader
              eyebrow="THE ATMOSPHERE"
              title="TRAIN IN A"
              highlight="DIFFERENT LEAGUE."
              description="More than equipment. An environment engineered to make you want to train."
            />

            <Button
              className="desktop-view-button"
              component={Link}
              to="/gallery"
              endIcon={<ArrowOutward />}
            >
              View Gallery
            </Button>
          </Box>

          <Box className="editorial-gallery">
            {visibleGallery.slice(0, 6).map((item, index) => {
              const image = getImage(item) || fallbackGallery[index]?.imageUrl;

              return (
                <Box
                  className={`gallery-tile gallery-tile-${index + 1}`}
                  key={item.id || index}
                >
                  <img src={image} alt="MyGym" />

                  <Box className="gallery-overlay">
                    <span>MYGYM</span>
                    <ArrowOutward />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </section>

      {/* ===================================================
          TRAINERS
          =================================================== */}

      <section className="premium-section trainers-section">
        <Container maxWidth="xl">
          <Box className="section-top-row">
            <PremiumSectionHeader
              eyebrow="THE COACHING TEAM"
              title="TRAIN WITH THE"
              highlight="BEST."
              description="Guidance from coaches who care about performance, not just attendance."
            />

            <Button
              className="desktop-view-button"
              onClick={() => navigate("/trainers")}
              endIcon={<ArrowOutward />}
            >
              Meet All Trainers
            </Button>
          </Box>

          <Grid container spacing={3}>
            {visibleTrainers.slice(0, 3).map((trainer, index) => {
              const image =
                getImage(trainer) || fallbackTrainers[index]?.imageUrl;

              return (
                <Grid size={{ xs: 12, md: 4 }} key={trainer.id || index}>
                  <Card className="coach-card">
                    <Box className="coach-image">
                      <CardMedia
                        component="img"
                        image={image}
                        alt={trainer.name}
                      />

                      <Box className="coach-gradient" />

                      <Box className="coach-number">0{index + 1}</Box>

                      <Box className="coach-content">
                        <Typography className="coach-name">
                          {trainer.name}
                        </Typography>

                        <Typography className="coach-role">
                          {trainer.specialization ||
                            trainer.speciality ||
                            trainer.role ||
                            "Performance Coach"}
                        </Typography>
                      </Box>

                      <Box className="coach-arrow">
                        <ArrowOutward />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </section>

      {/* ===================================================
          TESTIMONIALS
          =================================================== */}

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
                        {review.memberName || review.name || "MyGym Member"}
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

      {/* ===================================================
          LIFESTYLE
          =================================================== */}

      <section className="premium-section lifestyle-section">
        <Container maxWidth="xl">
          <PremiumSectionHeader
            eyebrow="MORE THAN TRAINING"
            title="BUILD A"
            highlight="BETTER LIFE."
            description="Your strongest self is built through the habits you keep outside the gym too."
          />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card className="lifestyle-luxury-card">
                <Box className="lifestyle-icon">
                  <Groups />
                </Box>

                <Typography className="lifestyle-number">01</Typography>

                <Typography className="lifestyle-title">COMMUNITY</Typography>

                <Typography className="lifestyle-text">
                  Surround yourself with people who push you to become better
                  every day.
                </Typography>

                <ArrowOutward className="lifestyle-arrow" />
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card className="lifestyle-luxury-card">
                <Box className="lifestyle-icon">
                  <Restaurant />
                </Box>

                <Typography className="lifestyle-number">02</Typography>

                <Typography className="lifestyle-title">NUTRITION</Typography>

                <Typography className="lifestyle-text">
                  Understand what your body needs to recover, perform and grow.
                </Typography>

                <ArrowOutward className="lifestyle-arrow" />
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card className="lifestyle-luxury-card">
                <Box className="lifestyle-icon">
                  <SelfImprovement />
                </Box>

                <Typography className="lifestyle-number">03</Typography>

                <Typography className="lifestyle-title">RECOVERY</Typography>

                <Typography className="lifestyle-text">
                  Train hard. Recover intelligently. Keep your body ready for
                  tomorrow.
                </Typography>

                <ArrowOutward className="lifestyle-arrow" />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* ===================================================
          FINAL CTA
          =================================================== */}

      <section className="ultimate-cta">
        <div className="cta-image" />
        <div className="cta-overlay" />
        <div className="cta-glow" />

        <Container maxWidth="xl">
          <Box className="cta-inner">
            <Box className="cta-label">
              <span />
              YOUR NEXT CHAPTER STARTS HERE
            </Box>

            <Typography className="cta-title">
              STOP
              <br />
              WAITING.
              <br />
              <span>START.</span>
            </Typography>

            <Typography className="cta-description">
              One decision can change the way you look, feel and perform. Take
              the first step today.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              className="cta-buttons"
            >
              <Button
                variant="contained"
                onClick={() => handleProtectedNavigation("/free-trial")}
                endIcon={<ArrowForward />}
              >
                Book Free Trial
              </Button>

              <Button
                variant="outlined"
                component={Link}
                to="/contact"
                endIcon={<ArrowOutward />}
              >
                Talk To Us
              </Button>
            </Stack>
          </Box>
        </Container>
      </section>

      {/* ERROR MESSAGE */}

      {error && (
        <Box className="home-error">
          <Container>
            <Alert severity="warning">{error}</Alert>
          </Container>
        </Box>
      )}
    </Box>
  );
}

// import { useEffect, useState } from "react";

// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Chip,
//   Stack,
//   Rating,
//   Avatar,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import "./Home.css";

// import { Link, useNavigate } from "react-router-dom";

// import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
// import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
// import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import GroupsIcon from "@mui/icons-material/Groups";
// import RestaurantIcon from "@mui/icons-material/Restaurant";

// import SectionTitle from "../components/SectionTitle";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const items = [
//   [
//     "Muscle Building",
//     <FitnessCenterIcon fontSize="large" />,
//     "Build strength and lean muscle.",
//   ],
//   [
//     "Fat Loss",
//     <LocalFireDepartmentIcon fontSize="large" />,
//     "Burn calories with structured training.",
//   ],
//   [
//     "Yoga & Mobility",
//     <SelfImprovementIcon fontSize="large" />,
//     "Improve flexibility and recovery.",
//   ],
// ];

// const getProgramIcon = (name = "") => {
//   const value = name.toLowerCase();

//   if (
//     value.includes("fat") ||
//     value.includes("loss") ||
//     value.includes("cardio")
//   ) {
//     return <LocalFireDepartmentIcon fontSize="large" />;
//   }

//   if (value.includes("yoga") || value.includes("mobility")) {
//     return <SelfImprovementIcon fontSize="large" />;
//   }

//   if (value.includes("running") || value.includes("fitness")) {
//     return <DirectionsRunIcon fontSize="large" />;
//   }

//   return <FitnessCenterIcon fontSize="large" />;
// };

// export default function Home() {
//   const navigate = useNavigate();

//   // IMPORTANT: your AuthContext provides user
//   const { user } = useAuth();

//   // Protected navigation
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

//   const [programs, setPrograms] = useState([]);
//   const [gallery, setGallery] = useState([]);
//   const [memberships, setMemberships] = useState([]);
//   const [trainers, setTrainers] = useState([]);
//   const [testimonials, setTestimonials] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadHomeData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const [
//           programsResponse,
//           galleryResponse,
//           membershipsResponse,
//           trainersResponse,
//           testimonialsResponse,
//         ] = await Promise.all([
//           api.get("/testimonials"),
//         ]);

//         setPrograms(
//           Array.isArray(programsResponse.data) ? programsResponse.data : [],
//         );

//         setGallery(
//           Array.isArray(galleryResponse.data) ? galleryResponse.data : [],
//         );

//         setMemberships(
//           Array.isArray(membershipsResponse.data)
//             ? membershipsResponse.data
//             : [],
//         );

//         setTrainers(
//           Array.isArray(trainersResponse.data) ? trainersResponse.data : [],
//         );

//         setTestimonials(
//           Array.isArray(testimonialsResponse.data)
//             ? testimonialsResponse.data
//             : [],
//         );
//       } catch (err) {
//         console.error("Home page API error:", err);

//         setError("Unable to load some fitness data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHomeData();
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "70vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Stack alignItems="center" spacing={2}>
//           <CircularProgress color="primary" />

//           <Typography color="text.secondary">
//             Loading Fitness Club...
//           </Typography>
//         </Stack>
//       </Box>
//     );
//   }

//   return (
//     <>
//       {/* HERO */}
//       <Box className="hero">
//         <Container>
//           <Typography color="primary" fontWeight={900} letterSpacing={3}>
//             YOUR FITNESS JOURNEY STARTS HERE
//           </Typography>

//           <Typography
//             sx={{
//               fontSize: {
//                 xs: "3.2rem",
//                 md: "6rem",
//               },
//               lineHeight: 0.95,
//               fontWeight: 1000,
//               mt: 2,
//             }}
//           >
//             BUILD YOUR
//             <br />
//             <span className="red">STRONGEST</span> SELF.
//           </Typography>

//           <Typography
//             variant="h6"
//             color="text.secondary"
//             sx={{
//               maxWidth: 650,
//               mt: 3,
//               lineHeight: 1.7,
//             }}
//           >
//             Premium equipment, expert coaches and a community that keeps you
//             accountable.
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               mt: 4,
//               flexWrap: "wrap",
//             }}
//           >
//             {/* BOOK FREE TRIAL */}
//             <Button
//               onClick={() => handleProtectedNavigation("/free-trial")}
//               variant="contained"
//               size="large"
//               endIcon={<ArrowForwardIcon />}
//             >
//               Book Free Trial
//             </Button>

//             {/* MEMBERSHIPS */}
//             <Button
//               onClick={() => handleProtectedNavigation("/memberships")}
//               variant="outlined"
//               size="large"
//             >
//               Memberships
//             </Button>
//           </Box>
//         </Container>
//       </Box>

//       {/* ERROR */}
//       {error && (
//         <Container sx={{ mt: 4 }}>
//           <Alert severity="warning">{error}</Alert>
//         </Container>
//       )}

//       {/* WHY US */}
//       <Container sx={{ py: 10 }}>
//         <SectionTitle
//           eyebrow="WHY US"
//           title="Everything you need to get results"
//         />

//         <Grid container spacing={3}>
//           {items.map(([name, icon, description]) => (
//             <Grid size={{ xs: 12, md: 4 }} key={name}>
//               <Card
//                 className="card"
//                 sx={{
//                   height: "100%",
//                   transition: "0.3s",
//                   "&:hover": {
//                     transform: "translateY(-8px)",
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 4 }}>
//                   <Box color="primary.main" sx={{ mb: 2 }}>
//                     {icon}
//                   </Box>

//                   <Typography variant="h5" fontWeight={900}>
//                     {name}
//                   </Typography>

//                   <Typography color="text.secondary" sx={{ mt: 1 }}>
//                     {description}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* PROGRAMS */}
//       <Box
//         sx={{
//           py: 10,
//           backgroundColor: "#0e0e11",
//         }}
//       >
//         <Container>
//           <SectionTitle eyebrow="OUR PROGRAMS" title="Train with purpose" />

//           {programs.length === 0 ? (
//             <Typography textAlign="center" color="text.secondary">
//               No programs available yet.
//             </Typography>
//           ) : (
//             <>
//               <Grid container spacing={3}>
//                 {programs.slice(0, 4).map((program) => (
//                   <Grid
//                     size={{
//                       xs: 12,
//                       sm: 6,
//                       md: 3,
//                     }}
//                     key={program.id}
//                   >
//                     <Card
//                       sx={{
//                         height: "100%",
//                         backgroundColor: "#151519",
//                         border: "1px solid #29292f",
//                         overflow: "hidden",
//                         transition: "0.3s",
//                         "&:hover": {
//                           transform: "translateY(-8px)",
//                           borderColor: "#e50914",
//                         },
//                       }}
//                     >
//                       {program.imageUrl && (
//                         <CardMedia
//                           component="img"
//                           height="200"
//                           image={program.imageUrl}
//                           alt={program.name}
//                         />
//                       )}

//                       <CardContent sx={{ p: 3 }}>
//                         <Box color="primary.main" sx={{ mb: 1 }}>
//                           {getProgramIcon(program.name)}
//                         </Box>

//                         <Typography variant="h6" fontWeight={900}>
//                           {program.name}
//                         </Typography>

//                         <Typography
//                           color="text.secondary"
//                           sx={{
//                             mt: 1,
//                             minHeight: 70,
//                           }}
//                         >
//                           {program.description}
//                         </Typography>

//                         {/* LEARN MORE */}
//                         <Button
//                           onClick={() => handleProtectedNavigation("/programs")}
//                           endIcon={<ArrowForwardIcon />}
//                           sx={{
//                             mt: 2,
//                             fontWeight: 800,
//                           }}
//                         >
//                           Learn More
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>

//               {/* VIEW ALL PROGRAMS */}
//               <Box textAlign="center" sx={{ mt: 5 }}>
//                 <Button
//                   onClick={() => handleProtectedNavigation("/programs")}
//                   variant="outlined"
//                   size="large"
//                 >
//                   View All Programs
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Container>
//       </Box>

//       {/* GALLERY */}
//       <Container sx={{ py: 10 }}>
//         <SectionTitle eyebrow="FITNESS GALLERY" title="Inside Fitness Club" />

//         {gallery.length === 0 ? (
//           <Typography textAlign="center" color="text.secondary">
//             Gallery images will appear here.
//           </Typography>
//         ) : (
//           <>
//             <Grid container spacing={2}>
//               {gallery.slice(0, 6).map((image) => (
//                 <Grid
//                   size={{
//                     xs: 12,
//                     sm: 6,
//                     md: 4,
//                   }}
//                   key={image.id}
//                 >
//                   <Box
//                     component="img"
//                     src={image.imageUrl}
//                     alt={image.title || image.name || "Fitness Club"}
//                     sx={{
//                       width: "100%",
//                       height: {
//                         xs: 250,
//                         md: 280,
//                       },
//                       objectFit: "cover",
//                       borderRadius: 2,
//                       display: "block",
//                       transition: "0.4s",
//                       "&:hover": {
//                         transform: "scale(1.03)",
//                         filter: "brightness(0.8)",
//                       },
//                     }}
//                   />
//                 </Grid>
//               ))}
//             </Grid>

//             <Box textAlign="center" sx={{ mt: 5 }}>
//               <Button component={Link} to="/gallery" variant="outlined">
//                 View Full Gallery
//               </Button>
//             </Box>
//           </>
//         )}
//       </Container>

//       {/* MEMBERSHIPS */}
//       <Box
//         sx={{
//           py: 10,
//           backgroundColor: "#0e0e11",
//         }}
//       >
//         <Container>
//           <SectionTitle
//             eyebrow="MEMBERSHIPS"
//             title="Choose your fitness plan"
//           />

//           {memberships.length === 0 ? (
//             <Typography textAlign="center" color="text.secondary">
//               Membership plans are currently unavailable.
//             </Typography>
//           ) : (
//             <>
//               <Grid container spacing={3}>
//                 {memberships.slice(0, 3).map((plan, index) => (
//                   <Grid
//                     size={{
//                       xs: 12,
//                       md: 4,
//                     }}
//                     key={plan.id}
//                   >
//                     <Card
//                       sx={{
//                         height: "100%",
//                         position: "relative",
//                         backgroundColor: "#151519",
//                         border:
//                           index === 1
//                             ? "2px solid #e50914"
//                             : "1px solid #29292f",
//                         borderRadius: 3,
//                         overflow: "visible",
//                       }}
//                     >
//                       {index === 1 && (
//                         <Chip
//                           label="POPULAR"
//                           color="primary"
//                           sx={{
//                             position: "absolute",
//                             top: -15,
//                             left: "50%",
//                             transform: "translateX(-50%)",
//                             fontWeight: 900,
//                           }}
//                         />
//                       )}

//                       <CardContent sx={{ p: 4 }}>
//                         <Typography variant="h5" fontWeight={900}>
//                           {plan.name}
//                         </Typography>

//                         <Typography
//                           color="text.secondary"
//                           sx={{
//                             mt: 1,
//                             minHeight: 45,
//                           }}
//                         >
//                           {plan.description}
//                         </Typography>

//                         <Box sx={{ my: 3 }}>
//                           <Typography variant="h3" fontWeight={1000}>
//                             ₹{plan.price}
//                             <Typography
//                               component="span"
//                               color="text.secondary"
//                               fontSize={15}
//                             >
//                               /month
//                             </Typography>
//                           </Typography>
//                         </Box>

//                         <Stack spacing={1.5}>
//                           {(Array.isArray(plan.features)
//                             ? plan.features
//                             : typeof plan.features === "string"
//                               ? plan.features.split(",").map((x) => x.trim())
//                               : []
//                           ).map((feature, featureIndex) => (
//                             <Stack
//                               direction="row"
//                               spacing={1}
//                               key={featureIndex}
//                             >
//                               <CheckCircleIcon
//                                 sx={{
//                                   color: "#e50914",
//                                   fontSize: 20,
//                                 }}
//                               />

//                               <Typography color="text.secondary">
//                                 {feature}
//                               </Typography>
//                             </Stack>
//                           ))}
//                         </Stack>

//                         {/* CHOOSE PLAN */}
//                         <Button
//                           onClick={() =>
//                             handleProtectedNavigation("/memberships")
//                           }
//                           variant={index === 1 ? "contained" : "outlined"}
//                           fullWidth
//                           size="large"
//                           sx={{
//                             mt: 4,
//                             fontWeight: 800,
//                           }}
//                         >
//                           Choose Plan
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>

//               {/* VIEW ALL MEMBERSHIPS */}
//               <Box textAlign="center" sx={{ mt: 5 }}>
//                 <Button
//                   onClick={() => handleProtectedNavigation("/memberships")}
//                   variant="outlined"
//                 >
//                   View All Memberships
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Container>
//       </Box>

//       {/* TRAINERS */}
//       <Container sx={{ py: 10 }}>
//         <SectionTitle eyebrow="OUR TEAM" title="Train with expert coaches" />

//         {trainers.length === 0 ? (
//           <Typography textAlign="center" color="text.secondary">
//             Trainers will appear here.
//           </Typography>
//         ) : (
//           <>
//             <Grid container spacing={3}>
//               {trainers.slice(0, 3).map((trainer) => (
//                 <Grid
//                   size={{
//                     xs: 12,
//                     sm: 6,
//                     md: 4,
//                   }}
//                   key={trainer.id}
//                 >
//                   <Card
//                     sx={{
//                       height: "100%",
//                       backgroundColor: "#151519",
//                       border: "1px solid #29292f",
//                       overflow: "hidden",
//                       transition: "0.3s",
//                       "&:hover": {
//                         transform: "translateY(-6px)",
//                       },
//                     }}
//                   >
//                     {trainer.imageUrl && (
//                       <CardMedia
//                         component="img"
//                         height="350"
//                         image={trainer.imageUrl}
//                         alt={trainer.name}
//                       />
//                     )}

//                     <CardContent sx={{ p: 3 }}>
//                       <Typography variant="h6" fontWeight={900}>
//                         {trainer.name}
//                       </Typography>

//                       <Typography color="primary" fontWeight={700}>
//                         {trainer.specialization ||
//                           trainer.speciality ||
//                           trainer.role ||
//                           "Fitness Trainer"}
//                       </Typography>

//                       {trainer.bio && (
//                         <Typography color="text.secondary" sx={{ mt: 1 }}>
//                           {trainer.bio}
//                         </Typography>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>

//             {/* MEET ALL TRAINERS */}
//             <Box textAlign="center" sx={{ mt: 5 }}>
//               <Button
//                 onClick={() => handleProtectedNavigation("/trainers")}
//                 variant="outlined"
//               >
//                 Meet All Trainers
//               </Button>
//             </Box>
//           </>
//         )}
//       </Container>

//       {/* TESTIMONIALS */}
//       <Box
//         sx={{
//           py: 10,
//           backgroundColor: "#0e0e11",
//         }}
//       >
//         <Container>
//           <SectionTitle eyebrow="TESTIMONIALS" title="What our members say" />

//           {testimonials.length === 0 ? (
//             <Typography textAlign="center" color="text.secondary">
//               Member testimonials will appear here.
//             </Typography>
//           ) : (
//             <Grid container spacing={3}>
//               {testimonials.slice(0, 3).map((testimonial) => (
//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 4,
//                   }}
//                   key={testimonial.id}
//                 >
//                   <Card
//                     sx={{
//                       height: "100%",
//                       backgroundColor: "#151519",
//                       border: "1px solid #29292f",
//                     }}
//                   >
//                     <CardContent sx={{ p: 4 }}>
//                       <Rating
//                         value={Number(testimonial.rating || 5)}
//                         readOnly
//                       />

//                       <Typography
//                         color="text.secondary"
//                         sx={{
//                           mt: 2,
//                           mb: 3,
//                           lineHeight: 1.8,
//                         }}
//                       >
//                         "{testimonial.message || testimonial.content}"
//                       </Typography>

//                       <Stack direction="row" spacing={2} alignItems="center">
//                         <Avatar>
//                           {(
//                             testimonial.memberName ||
//                             testimonial.name ||
//                             "M"
//                           ).charAt(0)}
//                         </Avatar>

//                         <Typography fontWeight={800}>
//                           {testimonial.memberName ||
//                             testimonial.name ||
//                             "Fitness Club Member"}
//                         </Typography>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </Container>
//       </Box>

//       {/* FEATURES */}
//       <Container sx={{ py: 10 }}>
//         <SectionTitle
//           eyebrow="MORE THAN A GYM"
//           title="Everything for a healthier lifestyle"
//         />

//         <Grid container spacing={3}>
//           <Grid size={{ xs: 12, md: 4 }}>
//             <Card
//               sx={{
//                 height: "100%",
//                 backgroundColor: "#151519",
//                 border: "1px solid #29292f",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <GroupsIcon
//                   sx={{
//                     fontSize: 45,
//                     color: "#e50914",
//                     mb: 2,
//                   }}
//                 />

//                 <Typography variant="h6" fontWeight={900}>
//                   Fitness Community
//                 </Typography>

//                 <Typography color="text.secondary" sx={{ mt: 1 }}>
//                   Train with motivated people and stay accountable throughout
//                   your journey.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid size={{ xs: 12, md: 4 }}>
//             <Card
//               sx={{
//                 height: "100%",
//                 backgroundColor: "#151519",
//                 border: "1px solid #29292f",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <RestaurantIcon
//                   sx={{
//                     fontSize: 45,
//                     color: "#e50914",
//                     mb: 2,
//                   }}
//                 />

//                 <Typography variant="h6" fontWeight={900}>
//                   Nutrition Guidance
//                 </Typography>

//                 <Typography color="text.secondary" sx={{ mt: 1 }}>
//                   Get practical nutrition guidance to support your training and
//                   fitness goals.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid size={{ xs: 12, md: 4 }}>
//             <Card
//               sx={{
//                 height: "100%",
//                 backgroundColor: "#151519",
//                 border: "1px solid #29292f",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <FitnessCenterIcon
//                   sx={{
//                     fontSize: 45,
//                     color: "#e50914",
//                     mb: 2,
//                   }}
//                 />

//                 <Typography variant="h6" fontWeight={900}>
//                   Premium Equipment
//                 </Typography>

//                 <Typography color="text.secondary" sx={{ mt: 1 }}>
//                   Access modern gym equipment designed for beginners and
//                   experienced athletes.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* FINAL CTA */}
//       <Box
//         sx={{
//           py: 10,
//           background: "linear-gradient(135deg, #e50914, #8f0008)",
//         }}
//       >
//         <Container>
//           <Box textAlign="center">
//             <Typography
//               variant="h2"
//               fontWeight={1000}
//               sx={{
//                 fontSize: {
//                   xs: "2.2rem",
//                   md: "4rem",
//                 },
//               }}
//             >
//               YOUR BEST SELF
//               <br />
//               STARTS TODAY.
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 2,
//                 mb: 4,
//                 maxWidth: 600,
//                 mx: "auto",
//                 opacity: 0.9,
//               }}
//             >
//               Stop waiting for the perfect time. Start your fitness journey with
//               Fitness Club today.
//             </Typography>

//             <Stack
//               direction={{
//                 xs: "column",
//                 sm: "row",
//               }}
//               spacing={2}
//               justifyContent="center"
//             >
//               {/* BOOK FREE TRIAL */}
//               <Button
//                 onClick={() => handleProtectedNavigation("/free-trial")}
//                 variant="contained"
//                 size="large"
//                 sx={{
//                   backgroundColor: "#fff",
//                   color: "#e50914",
//                   fontWeight: 900,
//                   px: 4,
//                   "&:hover": {
//                     backgroundColor: "#eee",
//                   },
//                 }}
//               >
//                 BOOK FREE TRIAL
//               </Button>

//               {/* CONTACT US */}
//               <Button
//                 component={Link}
//                 to="/contact"
//                 variant="outlined"
//                 size="large"
//                 sx={{
//                   color: "#fff",
//                   borderColor: "#fff",
//                   fontWeight: 900,
//                   px: 4,
//                   "&:hover": {
//                     borderColor: "#fff",
//                     backgroundColor: "rgba(255,255,255,0.1)",
//                   },
//                 }}
//               >
//                 CONTACT US
//               </Button>
//             </Stack>
//           </Box>
//         </Container>
//       </Box>
//     </>
//   );
// }
