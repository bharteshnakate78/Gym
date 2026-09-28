
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle,
  FitnessCenter,
  ArrowForward,
  WorkspacePremium,
  Star,
  AccessTime,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";

import api from "../services/api";
import PageIntro from "../components/PageIntro";

export default function Memberships() {
  const navigate = useNavigate();

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);

  // =========================================================
  // LOAD MEMBERSHIPS
  // =========================================================
  useEffect(() => {
    let mounted = true;

    const loadMemberships = async () => {
      try {
        setLoading(true);

        const response = await api.get("/memberships");

        if (!mounted) return;

        const data = response.data;

        setMemberships(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("MEMBERSHIP LOAD ERROR:", error);

        if (mounted) {
          setMemberships([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMemberships();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // START MEMBERSHIP
  // =========================================================
  const handleMembershipClick = (membership) => {
    console.log("=================================================");
    console.log("START MEMBERSHIP CLICKED");
    console.log("MEMBERSHIP:", membership);
    console.log("=================================================");

    // ---------------------------------------------------------
    // CHECK LOGIN
    // ---------------------------------------------------------
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error(
        "INVALID USER DATA IN LOCAL STORAGE:",
        error
      );

      localStorage.removeItem("user");
    }

    // ---------------------------------------------------------
    // NOT LOGGED IN
    // ---------------------------------------------------------
    if (!token || !user) {
      console.log("USER NOT LOGGED IN → LOGIN");

      navigate("/login", {
        state: {
          from: "/memberships",
          message:
            "Please login to continue with your membership.",
        },
      });

      return;
    }

    // ---------------------------------------------------------
    // INVALID MEMBERSHIP
    // ---------------------------------------------------------
    if (!membership || !membership.id) {
      console.error(
        "INVALID MEMBERSHIP:",
        membership
      );

      alert(
        "This membership could not be selected. Please try again."
      );

      return;
    }

    // ---------------------------------------------------------
    // PREPARE SELECTED MEMBERSHIP
    // ---------------------------------------------------------
    const selectedMembership = {
      id: membership.id,

      name: membership.name || "Membership",

      description:
        membership.description ||
        "Premium gym membership.",

      monthlyFee: Number(
        membership.monthlyFee || 0
      ),

      benefits: parseBenefits(
        membership.benefits
      ),
    };

    console.log(
      "SELECTED MEMBERSHIP:",
      selectedMembership
    );

    // ---------------------------------------------------------
    // SHOW BUTTON LOADING
    // ---------------------------------------------------------
    setSelectedMembershipId(membership.id);

    // ---------------------------------------------------------
    // GO TO PAYMENT PAGE
    // ---------------------------------------------------------
    navigate("/payment", {
      state: {
        membership: selectedMembership,
      },
    });
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <Box className="membership-page">

      {/* =====================================================
          PREMIUM BACKGROUND
      ====================================================== */}
      <Box className="membership-background">
        <div className="bg-grid" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </Box>

      {/* =====================================================
          PAGE INTRO
      ====================================================== */}
      <PageIntro
        eyebrow="MEMBERSHIPS"
        title="Choose the plan that keeps you moving."
        description="Get the access, support, and structure you need to make your training consistent and your progress measurable."
      />

      {/* =====================================================
          MEMBERSHIP CARDS
      ====================================================== */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 2,
          py: {
            xs: 5,
            md: 8,
          },
        }}
      >

        {/* ===================================================
            LOADING
        ==================================================== */}
        {loading && (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress
              size={42}
              sx={{
                color: "#e50914",
              }}
            />

            <Typography
              sx={{
                color: "#85858d",
                fontSize: "0.9rem",
              }}
            >
              Loading membership plans...
            </Typography>
          </Box>
        )}

        {/* ===================================================
            MEMBERSHIP LIST
        ==================================================== */}
        {!loading && memberships.length > 0 && (
          <Grid
            container
            spacing={3}
            alignItems="stretch"
          >

            {memberships.map(
              (membership, index) => {

                const isFeatured =
                  index === 1;

                const isSelecting =
                  selectedMembershipId ===
                  membership.id;

                return (
                  <Grid
                    key={
                      membership.id ||
                      membership.name ||
                      index
                    }
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                    sx={{
                      display: "flex",
                    }}
                  >

                    <Card
                      className={`membership-card ${
                        isFeatured
                          ? "featured-card"
                          : ""
                      }`}
                    >

                      {/* =================================================
                          MOST POPULAR
                      ================================================== */}
                      {isFeatured && (
                        <Box className="popular-badge">

                          <Star
                            sx={{
                              fontSize: 16,
                            }}
                          />

                          MOST POPULAR

                        </Box>
                      )}

                      <CardContent
                        className="membership-card-content"
                      >

                        {/* =================================================
                            ICON
                        ================================================== */}
                        <Box className="membership-icon">

                          {isFeatured ? (
                            <WorkspacePremium />
                          ) : (
                            <FitnessCenter />
                          )}

                        </Box>

                        {/* =================================================
                            PLAN NAME
                        ================================================== */}
                        <Typography
                          className="membership-title"
                        >
                          {membership.name}
                        </Typography>

                        {/* =================================================
                            DESCRIPTION
                        ================================================== */}
                        <Typography
                          className="membership-description"
                        >
                          {membership.description ||
                            "A focused membership for steady training and lasting progress."}
                        </Typography>

                        {/* =================================================
                            PRICE
                        ================================================== */}
                        <Box
                          className="membership-price-wrapper"
                        >

                          <Typography
                            className="currency"
                          >
                            ₹
                          </Typography>

                          <Typography
                            className="membership-price"
                          >
                            {Number(
                              membership.monthlyFee ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>

                          <Typography
                            className="price-period"
                          >
                            / month
                          </Typography>

                        </Box>

                        {/* =================================================
                            DIVIDER
                        ================================================== */}
                        <Box
                          className="membership-divider"
                        />

                        {/* =================================================
                            BENEFITS
                        ================================================== */}
                        <Box
                          className="benefits-container"
                        >

                          {parseBenefits(
                            membership.benefits
                          ).map(
                            (
                              benefit,
                              benefitIndex
                            ) => (

                              <Box
                                key={`${benefit}-${benefitIndex}`}
                                className="benefit-row"
                              >

                                <CheckCircle
                                  className="benefit-icon"
                                />

                                <Typography
                                  className="benefit-text"
                                >
                                  {benefit}
                                </Typography>

                              </Box>

                            )
                          )}

                        </Box>

                        {/* =================================================
                            START MEMBERSHIP BUTTON
                        ================================================== */}
                        <Button
                          onClick={() =>
                            handleMembershipClick(
                              membership
                            )
                          }
                          fullWidth
                          variant={
                            isFeatured
                              ? "contained"
                              : "outlined"
                          }
                          className={`membership-button ${
                            isFeatured
                              ? "featured-button"
                              : ""
                          }`}
                          endIcon={
                            isSelecting ? (
                              <CircularProgress
                                size={18}
                                sx={{
                                  color:
                                    "#ffffff",
                                }}
                              />
                            ) : (
                              <ArrowForward />
                            )
                          }
                          disabled={Boolean(
                            selectedMembershipId
                          )}
                        >
                          {isSelecting
                            ? "Opening payment..."
                            : "Start your membership"}
                        </Button>

                        {/* =================================================
                            TRUST TEXT
                        ================================================== */}
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          alignItems="center"
                          className="secure-text"
                        >

                          <AccessTime
                            sx={{
                              fontSize: 16,
                            }}
                          />

                          <Typography>
                            Flexible monthly
                            membership
                          </Typography>

                        </Stack>

                      </CardContent>

                    </Card>

                  </Grid>
                );
              }
            )}

          </Grid>
        )}

        {/* ===================================================
            NO MEMBERSHIPS
        ==================================================== */}
        {!loading &&
          memberships.length === 0 && (

            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

              <Typography
                sx={{
                  mt: 4,
                  textAlign: "center",
                  color: "#92929b",
                }}
              >
                Membership plans are
                currently unavailable.
                Please try again later.
              </Typography>

            </Box>
          )}

        {/* ===================================================
            BOTTOM TRUST SECTION
        ==================================================== */}
        <Box className="membership-trust">

          <Typography className="trust-title">
            Train with confidence.
          </Typography>

          <Typography
            className="trust-description"
          >
            Simple pricing, premium facilities,
            and a membership designed around
            your fitness journey.
          </Typography>

          <Box className="trust-items">

            <Box className="trust-item">

              <CheckCircle />

              <span>
                Premium equipment
              </span>

            </Box>

            <Box className="trust-item">

              <CheckCircle />

              <span>
                Expert support
              </span>

            </Box>

            <Box className="trust-item">

              <CheckCircle />

              <span>
                Flexible plans
              </span>

            </Box>

          </Box>

        </Box>

      </Container>

      {/* =====================================================
          PREMIUM CSS
      ====================================================== */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .membership-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(229, 9, 20, 0.09),
              transparent 35%
            ),
            #08080a;

          color: #fff;
        }

        /* =====================================================
           BACKGROUND
        ====================================================== */

        .membership-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-grid {
          position: absolute;
          inset: 0;

          opacity: 0.15;

          background-image:
            linear-gradient(
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            );

          background-size: 55px 55px;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }

        .glow-one {
          width: 400px;
          height: 400px;

          top: 300px;
          left: -200px;

          background:
            rgba(229, 9, 20, 0.08);
        }

        .glow-two {
          width: 350px;
          height: 350px;

          right: -150px;
          top: 600px;

          background:
            rgba(255, 40, 50, 0.06);
        }

        /* =====================================================
           CARD
        ====================================================== */

        .membership-card {
          position: relative;

          width: 100%;
          height: 100%;
          min-height: 590px;

          overflow: hidden;

          border-radius: 26px !important;

          background:
            linear-gradient(
              145deg,
              rgba(29, 29, 35, 0.96),
              rgba(10, 10, 13, 0.98)
            ) !important;

          border:
            1px solid
            rgba(255,255,255,0.08) !important;

          box-shadow:
            0 20px 70px
            rgba(0,0,0,0.45),

            inset 0 1px 0
            rgba(255,255,255,0.04);

          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        .membership-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.25),
              transparent
            );

          opacity: 0.5;
        }

        .membership-card:hover {
          transform:
            translateY(-10px);

          border-color:
            rgba(229, 9, 20, 0.4) !important;

          box-shadow:
            0 30px 90px
            rgba(0,0,0,0.6),

            0 0 45px
            rgba(229,9,20,0.08),

            inset 0 1px 0
            rgba(255,255,255,0.05);
        }

        .featured-card {
          border-color:
            rgba(229,9,20,0.35) !important;

          background:
            linear-gradient(
              145deg,
              rgba(35, 20, 22, 0.98),
              rgba(12, 10, 12, 0.99)
            ) !important;

          box-shadow:
            0 25px 90px
            rgba(0,0,0,0.55),

            0 0 50px
            rgba(229,9,20,0.08);
        }

        .membership-card-content {
          position: relative;
          z-index: 2;

          display: flex;
          flex-direction: column;

          height: 100%;

          padding: 38px !important;
        }

        /* =====================================================
           POPULAR BADGE
        ====================================================== */

        .popular-badge {
          position: absolute;

          top: 18px;
          right: 18px;

          display: flex;
          align-items: center;
          gap: 6px;

          padding:
            8px 13px;

          border-radius: 30px;

          background:
            linear-gradient(
              135deg,
              #e50914,
              #a80710
            );

          color: #fff;

          font-size: 0.68rem;

          font-weight: 900;

          letter-spacing: 0.08em;

          box-shadow:
            0 8px 25px
            rgba(229,9,20,0.25);
        }

        /* =====================================================
           ICON
        ====================================================== */

        .membership-icon {
          width: 58px;
          height: 58px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 25px;

          border-radius: 18px;

          color: #ff4d55;

          background:
            linear-gradient(
              145deg,
              rgba(229,9,20,0.17),
              rgba(229,9,20,0.04)
            );

          border:
            1px solid
            rgba(229,9,20,0.16);

          box-shadow:
            inset 0 1px 0
            rgba(255,255,255,0.04);
        }

        .membership-icon svg {
          font-size: 29px;
        }

        /* =====================================================
           TITLE
        ====================================================== */

        .membership-title {
          color: #fff !important;

          font-size: 1.65rem !important;

          line-height: 1.2 !important;

          font-weight: 900 !important;

          letter-spacing: -0.03em;

          margin-bottom: 12px !important;
        }

        .membership-description {
          color: #92929b !important;

          font-size: 0.93rem !important;

          line-height: 1.75 !important;

          min-height: 78px;

          max-width: 470px;
        }

        /* =====================================================
           PRICE
        ====================================================== */

        .membership-price-wrapper {
          display: flex;

          align-items: baseline;

          margin-top: 27px;
        }

        .currency {
          color: #ff5a61 !important;

          font-size: 1.35rem !important;

          font-weight: 800 !important;

          margin-right: 4px !important;
        }

        .membership-price {
          color: #fff !important;

          font-size: 3.05rem !important;

          line-height: 1 !important;

          font-weight: 950 !important;

          letter-spacing: -0.06em;
        }

        .price-period {
          color: #777780 !important;

          font-size: 0.86rem !important;

          margin-left: 7px !important;
        }

        /* =====================================================
           DIVIDER
        ====================================================== */

        .membership-divider {
          height: 1px;

          margin:
            30px 0 25px;

          background:
            linear-gradient(
              90deg,
              rgba(255,255,255,0.13),
              rgba(255,255,255,0.025)
            );
        }

        /* =====================================================
           BENEFITS
        ====================================================== */

        .benefits-container {
          flex-grow: 1;
        }

        .benefit-row {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          margin-bottom: 15px;
        }

        .benefit-icon {
          flex-shrink: 0;

          margin-top: 2px;

          color: #ff4d55 !important;

          font-size: 18px !important;
        }

        .benefit-text {
          color: #d1d1d6 !important;

          font-size: 0.9rem !important;

          line-height: 1.5 !important;
        }

        /* =====================================================
           BUTTON
        ====================================================== */

        .membership-button {
          min-height: 54px !important;

          margin-top: 25px !important;

          border-radius: 15px !important;

          font-size: 0.93rem !important;

          font-weight: 850 !important;

          text-transform: none !important;

          border-color:
            rgba(255,255,255,0.17) !important;

          color: #fff !important;

          transition:
            all 0.3s ease !important;
        }

        .membership-button:hover {
          transform:
            translateY(-2px);

          border-color:
            rgba(229,9,20,0.65) !important;

          background:
            rgba(229,9,20,0.08) !important;
        }

        .membership-button:disabled {
          opacity: 0.85;

          cursor: wait;
        }

        .featured-button {
          border: none !important;

          background:
            linear-gradient(
              135deg,
              #e50914,
              #b50710
            ) !important;

          box-shadow:
            0 12px 30px
            rgba(229,9,20,0.2);
        }

        .featured-button:hover {
          background:
            linear-gradient(
              135deg,
              #ff1b26,
              #c70812
            ) !important;

          box-shadow:
            0 15px 40px
            rgba(229,9,20,0.32);

          transform:
            translateY(-3px);
        }

        /* =====================================================
           SMALL TEXT
        ====================================================== */

        .secure-text {
          margin-top: 16px;

          color: #65656d;
        }

        .secure-text svg {
          color: #777780;
        }

        .secure-text p {
          font-size: 0.72rem;
        }

        /* =====================================================
           TRUST SECTION
        ====================================================== */

        .membership-trust {
          margin-top: 70px;

          padding:
            50px 25px;

          text-align: center;

          border-radius: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.035),
              rgba(255,255,255,0.012)
            );

          border:
            1px solid
            rgba(255,255,255,0.07);

          box-shadow:
            inset 0 1px 0
            rgba(255,255,255,0.03);
        }

        .trust-title {
          color: #fff !important;

          font-size: 2rem !important;

          font-weight: 900 !important;

          letter-spacing: -0.04em;
        }

        .trust-description {
          max-width: 650px;

          margin:
            12px auto 0 !important;

          color: #85858d !important;

          line-height: 1.7 !important;
        }

        .trust-items {
          display: flex;

          justify-content: center;

          flex-wrap: wrap;

          gap: 30px;

          margin-top: 30px;
        }

        .trust-item {
          display: flex;

          align-items: center;

          gap: 8px;

          color: #c8c8cd;

          font-size: 0.85rem;

          font-weight: 700;
        }

        .trust-item svg {
          color: #ff4d55;

          font-size: 18px;
        }

        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 900px) {

          .membership-card {
            min-height: auto;
          }

          .membership-card-content {
            padding: 30px !important;
          }

          .membership-title {
            font-size: 1.45rem !important;
          }

          .membership-price {
            font-size: 2.65rem !important;
          }

        }

        @media (max-width: 600px) {

          .membership-card-content {
            padding: 25px !important;
          }

          .popular-badge {
            position: relative;

            top: auto;
            right: auto;

            width: fit-content;

            margin:
              20px 20px 0 auto;
          }

          .membership-icon {
            margin-top: 5px;
          }

          .membership-price {
            font-size: 2.4rem !important;
          }

          .trust-title {
            font-size: 1.55rem !important;
          }

          .trust-items {
            flex-direction: column;

            align-items: center;

            gap: 15px;
          }

        }

      `}</style>

    </Box>
  );
}

// =============================================================
// BENEFITS PARSER
// =============================================================

function parseBenefits(benefits) {
  const parsed = String(benefits || "")
    .split(/[,\n]/)
    .map((benefit) => benefit.trim())
    .filter(Boolean);

  return parsed.length
    ? parsed
    : [
        "Access to gym equipment",
        "Member support",
      ];
}




//       {/* =====================================================
//           SINGLE PAGE CSS
//       ====================================================== */}
//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         .membership-page {
//           position: relative;
//           min-height: 100vh;
//           overflow: hidden;
//           background:
//             radial-gradient(
//               circle at 50% 0%,
//               rgba(229, 9, 20, 0.09),
//               transparent 35%
//             ),
//             #08080a;
//           color: #fff;
//         }

//         .membership-background {
//           position: absolute;
//           inset: 0;
//           pointer-events: none;
//           overflow: hidden;
//         }

//         .bg-grid {
//           position: absolute;
//           inset: 0;
//           opacity: 0.15;
//           background-image:
//             linear-gradient(
//               rgba(255,255,255,0.035) 1px,
//               transparent 1px
//             ),
//             linear-gradient(
//               90deg,
//               rgba(255,255,255,0.035) 1px,
//               transparent 1px
//             );
//           background-size: 55px 55px;
//         }

//         .glow {
//           position: absolute;
//           border-radius: 50%;
//           filter: blur(100px);
//         }

//         .glow-one {
//           width: 400px;
//           height: 400px;
//           top: 300px;
//           left: -200px;
//           background: rgba(229, 9, 20, 0.08);
//         }

//         .glow-two {
//           width: 350px;
//           height: 350px;
//           right: -150px;
//           top: 600px;
//           background: rgba(255, 40, 50, 0.06);
//         }

//         /* =====================================================
//            CARD
//         ====================================================== */

//         .membership-card {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           min-height: 590px;

//           overflow: hidden;

//           border-radius: 26px !important;

//           background:
//             linear-gradient(
//               145deg,
//               rgba(29, 29, 35, 0.96),
//               rgba(10, 10, 13, 0.98)
//             ) !important;

//           border: 1px solid rgba(255,255,255,0.08) !important;

//           box-shadow:
//             0 20px 70px rgba(0,0,0,0.45),
//             inset 0 1px 0 rgba(255,255,255,0.04);

//           transition:
//             transform 0.35s ease,
//             border-color 0.35s ease,
//             box-shadow 0.35s ease;
//         }

//         .membership-card::before {
//           content: "";
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 1px;

//           background:
//             linear-gradient(
//               90deg,
//               transparent,
//               rgba(255,255,255,0.25),
//               transparent
//             );

//           opacity: 0.5;
//         }

//         .membership-card:hover {
//           transform: translateY(-10px);

//           border-color:
//             rgba(229, 9, 20, 0.4) !important;

//           box-shadow:
//             0 30px 90px rgba(0,0,0,0.6),
//             0 0 45px rgba(229,9,20,0.08),
//             inset 0 1px 0 rgba(255,255,255,0.05);
//         }

//         .featured-card {
//           border-color:
//             rgba(229,9,20,0.35) !important;

//           background:
//             linear-gradient(
//               145deg,
//               rgba(35, 20, 22, 0.98),
//               rgba(12, 10, 12, 0.99)
//             ) !important;

//           box-shadow:
//             0 25px 90px rgba(0,0,0,0.55),
//             0 0 50px rgba(229,9,20,0.08);
//         }

//         .membership-card-content {
//           position: relative;
//           z-index: 2;

//           display: flex;
//           flex-direction: column;

//           height: 100%;
//           padding: 38px !important;
//         }

//         /* =====================================================
//            POPULAR BADGE
//         ====================================================== */

//         .popular-badge {
//           position: absolute;
//           top: 18px;
//           right: 18px;

//           display: flex;
//           align-items: center;
//           gap: 6px;

//           padding: 8px 13px;

//           border-radius: 30px;

//           background:
//             linear-gradient(
//               135deg,
//               #e50914,
//               #a80710
//             );

//           color: #fff;

//           font-size: 0.68rem;
//           font-weight: 900;
//           letter-spacing: 0.08em;

//           box-shadow:
//             0 8px 25px rgba(229,9,20,0.25);
//         }

//         /* =====================================================
//            ICON
//         ====================================================== */

//         .membership-icon {
//           width: 58px;
//           height: 58px;

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           margin-bottom: 25px;

//           border-radius: 18px;

//           color: #ff4d55;

//           background:
//             linear-gradient(
//               145deg,
//               rgba(229,9,20,0.17),
//               rgba(229,9,20,0.04)
//             );

//           border: 1px solid rgba(229,9,20,0.16);

//           box-shadow:
//             inset 0 1px 0 rgba(255,255,255,0.04);
//         }

//         .membership-icon svg {
//           font-size: 29px;
//         }

//         /* =====================================================
//            TITLE
//         ====================================================== */

//         .membership-title {
//           color: #fff !important;

//           font-size: 1.65rem !important;
//           line-height: 1.2 !important;

//           font-weight: 900 !important;

//           letter-spacing: -0.03em;

//           margin-bottom: 12px !important;
//         }

//         .membership-description {
//           color: #92929b !important;

//           font-size: 0.93rem !important;

//           line-height: 1.75 !important;

//           min-height: 78px;

//           max-width: 470px;
//         }

//         /* =====================================================
//            PRICE
//         ====================================================== */

//         .membership-price-wrapper {
//           display: flex;
//           align-items: baseline;

//           margin-top: 27px;
//         }

//         .currency {
//           color: #ff5a61 !important;

//           font-size: 1.35rem !important;
//           font-weight: 800 !important;

//           margin-right: 4px !important;
//         }

//         .membership-price {
//           color: #fff !important;

//           font-size: 3.05rem !important;

//           line-height: 1 !important;

//           font-weight: 950 !important;

//           letter-spacing: -0.06em;
//         }

//         .price-period {
//           color: #777780 !important;

//           font-size: 0.86rem !important;

//           margin-left: 7px !important;
//         }

//         /* =====================================================
//            DIVIDER
//         ====================================================== */

//         .membership-divider {
//           height: 1px;

//           margin: 30px 0 25px;

//           background:
//             linear-gradient(
//               90deg,
//               rgba(255,255,255,0.13),
//               rgba(255,255,255,0.025)
//             );
//         }

//         /* =====================================================
//            BENEFITS
//         ====================================================== */

//         .benefits-container {
//           flex-grow: 1;
//         }

//         .benefit-row {
//           display: flex;
//           align-items: flex-start;

//           gap: 10px;

//           margin-bottom: 15px;
//         }

//         .benefit-icon {
//           flex-shrink: 0;

//           margin-top: 2px;

//           color: #ff4d55 !important;

//           font-size: 18px !important;
//         }

//         .benefit-text {
//           color: #d1d1d6 !important;

//           font-size: 0.9rem !important;

//           line-height: 1.5 !important;
//         }

//         /* =====================================================
//            BUTTON
//         ====================================================== */

//         .membership-button {
//           min-height: 54px !important;

//           margin-top: 25px !important;

//           border-radius: 15px !important;

//           font-size: 0.93rem !important;

//           font-weight: 850 !important;

//           text-transform: none !important;

//           letter-spacing: 0.01em;

//           border-color:
//             rgba(255,255,255,0.17) !important;

//           color: #fff !important;

//           transition:
//             all 0.3s ease !important;
//         }

//         .membership-button:hover {
//           transform: translateY(-2px);

//           border-color:
//             rgba(229,9,20,0.65) !important;

//           background:
//             rgba(229,9,20,0.08) !important;
//         }

//         .featured-button {
//           border: none !important;

//           background:
//             linear-gradient(
//               135deg,
//               #e50914,
//               #b50710
//             ) !important;

//           box-shadow:
//             0 12px 30px rgba(229,9,20,0.2);
//         }

//         .featured-button:hover {
//           background:
//             linear-gradient(
//               135deg,
//               #ff1b26,
//               #c70812
//             ) !important;

//           box-shadow:
//             0 15px 40px rgba(229,9,20,0.32);

//           transform: translateY(-3px);
//         }

//         /* =====================================================
//            SMALL TEXT
//         ====================================================== */

//         .secure-text {
//           margin-top: 16px;
//           color: #65656d;
//         }

//         .secure-text svg {
//           color: #777780;
//         }

//         .secure-text p {
//           font-size: 0.72rem;
//         }

//         /* =====================================================
//            TRUST SECTION
//         ====================================================== */

//         .membership-trust {
//           margin-top: 70px;
//           padding: 50px 25px;

//           text-align: center;

//           border-radius: 28px;

//           background:
//             linear-gradient(
//               145deg,
//               rgba(255,255,255,0.035),
//               rgba(255,255,255,0.012)
//             );

//           border:
//             1px solid rgba(255,255,255,0.07);

//           box-shadow:
//             inset 0 1px 0 rgba(255,255,255,0.03);
//         }

//         .trust-title {
//           color: #fff !important;

//           font-size: 2rem !important;
//           font-weight: 900 !important;

//           letter-spacing: -0.04em;
//         }

//         .trust-description {
//           max-width: 650px;

//           margin: 12px auto 0 !important;

//           color: #85858d !important;

//           line-height: 1.7 !important;
//         }

//         .trust-items {
//           display: flex;
//           justify-content: center;
//           flex-wrap: wrap;

//           gap: 30px;

//           margin-top: 30px;
//         }

//         .trust-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;

//           color: #c8c8cd;

//           font-size: 0.85rem;
//           font-weight: 700;
//         }

//         .trust-item svg {
//           color: #ff4d55;
//           font-size: 18px;
//         }

//         /* =====================================================
//            MOBILE
//         ====================================================== */

//         @media (max-width: 900px) {
//           .membership-card {
//             min-height: auto;
//           }

//           .membership-card-content {
//             padding: 30px !important;
//           }

//           .membership-title {
//             font-size: 1.45rem !important;
//           }

//           .membership-price {
//             font-size: 2.65rem !important;
//           }
//         }

//         @media (max-width: 600px) {
//           .membership-card-content {
//             padding: 25px !important;
//           }

//           .popular-badge {
//             position: relative;

//             top: auto;
//             right: auto;

//             width: fit-content;

//             margin: 20px 20px 0 auto;
//           }

//           .membership-icon {
//             margin-top: 5px;
//           }

//           .membership-price {
//             font-size: 2.4rem !important;
//           }

//           .trust-title {
//             font-size: 1.55rem !important;
//           }

//           .trust-items {
//             flex-direction: column;
//             align-items: center;
//             gap: 15px;
//           }
//         }
//       `}</style>
//     </Box>
//   );
// }

// // =============================================================
// // BENEFITS PARSER
// // =============================================================

// function parseBenefits(benefits) {
//   const parsed = String(benefits || "")
//     .split(/[,\n]/)
//     .map((benefit) => benefit.trim())
//     .filter(Boolean);

//   return parsed.length ? parsed : ["Access to gym equipment", "Member support"];
// }

// // import { staticMemberships } from "../data/staticContent";
// // import { CheckCircle, FitnessCenter } from "@mui/icons-material";
// // import {
// // 	Box,
// // 	Button,
// // 	Card,
// // 	CardContent,
// // 	Container,
// // 	Grid,
// // 	Typography,
// // } from "@mui/material";
// // import { Link } from "react-router-dom";
// // import PageIntro from "../components/PageIntro";

// // export default function Memberships() {
// // 	return (
// // 		<Box sx={{ minHeight: "100vh", background: "#08080a", color: "#fff" }}>
// // 			<PageIntro
// // 				eyebrow="MEMBERSHIPS"
// // 				title="Choose the plan that keeps you moving."
// // 				description="Get the access, support, and structure you need to make your training consistent and your progress measurable."
// // 			/>

// // 			<Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
// // 				<Grid container spacing={3} alignItems="stretch">
// // 					{staticMemberships.map((membership, index) => (
// // 							<Grid
// // 								key={membership.id || membership.name || index}
// // 								size={{ xs: 12, md: 4 }}
// // 								sx={{ display: "flex" }}
// // 							>
// // 								<Card sx={cardSx}>
// // 									<CardContent
// // 										sx={{
// // 											display: "flex",
// // 											flexDirection: "column",
// // 											height: "100%",
// // 											p: { xs: 3, md: 4 },
// // 										}}
// // 									>
// // 										<Box sx={iconSx}>
// // 											<FitnessCenter />
// // 										</Box>
// // 										<Typography sx={titleSx}>{membership.name}</Typography>
// // 										<Typography sx={descriptionSx}>
// // 											{membership.description ||
// // 												"A focused membership for steady training and lasting progress."}
// // 										</Typography>
// // 										<Typography sx={priceSx}>
// // 											<Box component="span" sx={{ fontSize: "1.2rem" }}>
// // 												₹
// // 											</Box>
// // 											{Number(membership.monthlyFee || 0).toLocaleString(
// // 												"en-IN",
// // 											)}
// // 											<Box component="span" sx={perMonthSx}>
// // 												/ month
// // 											</Box>
// // 										</Typography>
// // 										<Box sx={dividerSx} />
// // 										<Box sx={{ flexGrow: 1 }}>
// // 											{parseBenefits(membership.benefits).map((benefit) => (
// // 												<Box key={benefit} sx={benefitSx}>
// // 													<CheckCircle sx={{ color: "#ff4d55", fontSize: 19 }} />
// // 													<Typography sx={{ color: "#d0d0d5" }}>
// // 														{benefit}
// // 													</Typography>
// // 												</Box>
// // 											))}
// // 										</Box>
// // 										<Button
// // 											component={Link}
// // 											to="/register"
// // 											variant={index === 1 ? "contained" : "outlined"}
// // 											fullWidth
// // 											sx={buttonSx(index === 1)}
// // 										>
// // 											Start your membership
// // 										</Button>
// // 									</CardContent>
// // 								</Card>
// // 							</Grid>
// // 					))}
// // 				</Grid>
// // 			</Container>
// // 		</Box>
// // 	);
// // }

// // function parseBenefits(benefits) {
// // 	const parsed = String(benefits || "")
// // 		.split(/[,\n]/)
// // 		.map((benefit) => benefit.trim())
// // 		.filter(Boolean);

// // 	return parsed.length ? parsed : ["Access to gym equipment", "Member support"];
// // }

// // const cardSx = {
// // 	width: "100%",
// // 	borderRadius: 2,
// // 	background: "linear-gradient(145deg, #19191e, #0c0c0f)",
// // 	border: "1px solid rgba(255,255,255,.08)",
// // 	color: "#fff",
// // 	transition: ".3s",
// // 	"&:hover": {
// // 		transform: "translateY(-6px)",
// // 		borderColor: "rgba(229,9,20,.55)",
// // 	},
// // };

// // const iconSx = {
// // 	width: 48,
// // 	height: 48,
// // 	display: "flex",
// // 	alignItems: "center",
// // 	justifyContent: "center",
// // 	color: "#ff4d55",
// // 	background: "rgba(229,9,20,.1)",
// // 	borderRadius: 1.5,
// // 	mb: 3,
// // };

// // const titleSx = { fontSize: "1.45rem", fontWeight: 900, mb: 1.2 };
// // const descriptionSx = { color: "#9b9ba3", lineHeight: 1.75, minHeight: 82 };
// // const priceSx = { mt: 3, fontSize: "2.5rem", fontWeight: 900 };
// // const perMonthSx = { color: "#999", fontSize: "0.9rem", fontWeight: 500 };
// // const dividerSx = {
// // 	height: 1,
// // 	background: "rgba(255,255,255,.1)",
// // 	my: 3,
// // };
// // const benefitSx = {
// // 	display: "flex",
// // 	alignItems: "center",
// // 	gap: 1,
// // 	mb: 1.5,
// // };
// // const buttonSx = (featured) => ({
// // 	mt: 4,
// // 	py: 1.35,
// // 	borderRadius: 1.5,
// // 	fontWeight: 800,
// // 	textTransform: "none",
// // 	borderColor: "rgba(255,255,255,.24)",
// // 	...(featured && {
// // 		background: "#e50914",
// // 		"&:hover": { background: "#ff1a26" },
// // 	}),
// // });
