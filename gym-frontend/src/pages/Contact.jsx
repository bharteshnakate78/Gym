import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Grid,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";

import {
  Send,
  Phone,
  Email,
  Person,
  LocationOn,
  AccessTime,
  FitnessCenter,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";

import api from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (status) {
      setStatus("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      await api.post("/contacts", form);

      setStatus("success");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 15%, rgba(229,57,53,0.12), transparent 30%), radial-gradient(circle at 85% 75%, rgba(229,57,53,0.08), transparent 28%), #08090c",
        color: "#fff",
        py: { xs: 5, md: 9 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative glow */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(229,57,53,0.08)",
          filter: "blur(100px)",
          top: -180,
          right: -120,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(229,57,53,0.06)",
          filter: "blur(90px)",
          bottom: -150,
          left: -100,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* =====================================================
            HERO
        ===================================================== */}
        <Box
          textAlign="center"
          sx={{
            mb: { xs: 5, md: 7 },
            maxWidth: 760,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.8,
              mb: 2,
              borderRadius: 10,
              border: "1px solid rgba(229,57,53,0.35)",
              background: "rgba(229,57,53,0.08)",
              color: "#ff625e",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            <FitnessCenter sx={{ fontSize: 17 }} />
            Get In Touch
          </Box>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4.2rem" },
              fontWeight: 950,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              mb: 2,
            }}
          >
            Let's Build Your
            <Box component="span" sx={{ color: "#e53935", ml: 1 }}>
              Stronger
            </Box>
            <br />
            Future
          </Typography>

          <Typography
            sx={{
              color: "#96969d",
              fontSize: { xs: "0.98rem", md: "1.08rem" },
              lineHeight: 1.8,
              maxWidth: 650,
              mx: "auto",
            }}
          >
            Have questions about memberships, personal training, programs, or
            anything else? Our team is ready to help you take the next step.
          </Typography>
        </Box>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* =================================================
              LEFT INFO
          ================================================= */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background:
                  "linear-gradient(145deg, rgba(22,22,28,0.98), rgba(12,12,16,0.98))",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Red top accent */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 3,
                  background:
                    "linear-gradient(90deg, #e53935, #ff6b66, transparent)",
                }}
              />

              <Typography
                sx={{
                  fontSize: "1.7rem",
                  fontWeight: 900,
                  mb: 1,
                }}
              >
                Contact Information
              </Typography>

              <Typography
                sx={{
                  color: "#85858c",
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                Reach out to us and our fitness experts will be happy to guide
                you.
              </Typography>

              <Stack spacing={2}>
                <ContactInfo
                  icon={<Phone />}
                  title="Phone"
                  value="+91 98765 43210"
                />

                <ContactInfo
                  icon={<Email />}
                  title="Email"
                  value="support@mygym.com"
                />

                <ContactInfo
                  icon={<LocationOn />}
                  title="Location"
                  value="Sangli, Maharashtra, India"
                />

                <ContactInfo
                  icon={<AccessTime />}
                  title="Opening Hours"
                  value="Mon - Sun • 5:00 AM - 11:00 PM"
                />
              </Stack>

              <Divider
                sx={{
                  my: 4,
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              />

              {/* Why contact */}
              <Typography
                sx={{
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Why choose MyGym?
              </Typography>

              <Stack spacing={1.5}>
                {[
                  "Expert trainers",
                  "Modern equipment",
                  "Flexible memberships",
                  "Personalized fitness plans",
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      color: "#bdbdc3",
                    }}
                  >
                    <CheckCircle
                      sx={{
                        color: "#e53935",
                        fontSize: 19,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Mini CTA */}
              <Box
                sx={{
                  mt: 4,
                  p: 2.2,
                  borderRadius: 3,
                  background: "rgba(229,57,53,0.07)",
                  border: "1px solid rgba(229,57,53,0.18)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    mb: 0.5,
                  }}
                >
                  Ready to get started?
                </Typography>

                <Typography
                  sx={{
                    color: "#888890",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                  }}
                >
                  Send us a message and let's create your perfect fitness
                  journey.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* =================================================
              RIGHT FORM
          ================================================= */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5, md: 4.5 },
                borderRadius: 4,
                background:
                  "linear-gradient(145deg, rgba(23,23,29,0.98), rgba(12,12,16,0.98))",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 100,
                  height: 3,
                  background: "#e53935",
                }}
              />

              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: "1.7rem",
                    fontWeight: 900,
                    mb: 0.7,
                  }}
                >
                  Send Us a Message
                </Typography>

                <Typography
                  sx={{
                    color: "#85858c",
                    fontSize: "0.92rem",
                  }}
                >
                  Fill out the form below and we'll get back to you.
                </Typography>
              </Box>

              {/* =================================================
                  ALERTS
              ================================================= */}
              {status === "success" && (
                <Alert
                  icon={<CheckCircle fontSize="inherit" />}
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 2.5,
                    background: "rgba(46,125,50,0.12)",
                    color: "#8de18f",
                    border: "1px solid rgba(76,175,80,0.2)",
                    "& .MuiAlert-icon": {
                      color: "#4caf50",
                    },
                  }}
                >
                  Your message has been sent successfully. We will contact you
                  soon.
                </Alert>
              )}

              {status === "error" && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2.5,
                    background: "rgba(229,57,53,0.12)",
                    color: "#ff8a86",
                    border: "1px solid rgba(229,57,53,0.2)",
                  }}
                >
                  Could not send your message. Please try again.
                </Alert>
              )}

              {/* =================================================
                  FORM
              ================================================= */}
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.2}>
                  {/* Name */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      name="name"
                      label="Full Name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <Person
                            sx={{
                              mr: 1.2,
                              color: "#e53935",
                              fontSize: 21,
                            }}
                          />
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      name="email"
                      label="Email Address"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <Email
                            sx={{
                              mr: 1.2,
                              color: "#e53935",
                              fontSize: 21,
                            }}
                          />
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      type="tel"
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={handleChange}
                      inputProps={{
                        maxLength: 15,
                      }}
                      InputProps={{
                        startAdornment: (
                          <Phone
                            sx={{
                              mr: 1.2,
                              color: "#e53935",
                              fontSize: 21,
                            }}
                          />
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Grid>

                  {/* Message */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={6}
                      name="message"
                      label="Your Message"
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={handleChange}
                      inputProps={{
                        maxLength: 1000,
                      }}
                      helperText={`${form.message.length}/1000 characters`}
                      sx={inputStyle}
                    />
                  </Grid>

                  {/* Submit */}
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      variant="contained"
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Send />
                        )
                      }
                      endIcon={!loading && <ArrowForward />}
                      sx={{
                        mt: 0.5,
                        py: 1.65,
                        px: 3,
                        borderRadius: 2.5,
                        fontSize: "1rem",
                        fontWeight: 900,
                        letterSpacing: 0.3,
                        textTransform: "none",
                        color: "#fff",
                        background: "linear-gradient(135deg, #e53935, #c62828)",
                        boxShadow: "0 12px 30px rgba(229,57,53,0.25)",
                        transition: "all 0.25s ease",

                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #f44336, #d32f2f)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 16px 35px rgba(229,57,53,0.35)",
                        },

                        "&:active": {
                          transform: "translateY(0)",
                        },

                        "&:disabled": {
                          color: "#aaa",
                          background: "#333338",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

/* ============================================================
   CONTACT INFO COMPONENT
============================================================ */

function ContactInfo({ icon, title, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        borderRadius: 2.5,
        transition: "all 0.25s ease",

        "&:hover": {
          background: "rgba(255,255,255,0.035)",
          transform: "translateX(4px)",
        },
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          minWidth: 46,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(229,57,53,0.1)",
          border: "1px solid rgba(229,57,53,0.2)",
          color: "#e53935",
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: "#77777f",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            mb: 0.25,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#eee",
            fontSize: "0.9rem",
            fontWeight: 700,
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

/* ============================================================
   INPUT STYLE
============================================================ */

const inputStyle = {
  "& .MuiInputLabel-root": {
    color: "#85858d",
    fontWeight: 500,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#e53935",
  },

  "& .MuiOutlinedInput-root": {
    color: "#fff",
    background:
      "linear-gradient(145deg, rgba(8,8,12,0.9), rgba(15,15,20,0.95))",
    borderRadius: 2.2,
    transition: "all 0.25s ease",

    "& fieldset": {
      borderColor: "#303038",
      transition: "all 0.25s ease",
    },

    "&:hover": {
      background: "#101015",

      "& fieldset": {
        borderColor: "#505058",
      },
    },

    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(229,57,53,0.08)",

      "& fieldset": {
        borderColor: "#e53935",
        borderWidth: 1,
      },
    },

    "& input::placeholder": {
      color: "#55555d",
      opacity: 1,
    },

    "& textarea::placeholder": {
      color: "#55555d",
      opacity: 1,
    },
  },

  "& .MuiFormHelperText-root": {
    color: "#66666e",
    marginLeft: 2,
    marginRight: 2,
  },
};

// // import { useState } from "react";
// // import {
// //   Container,
// //   Box,
// //   TextField,
// //   Button,
// //   Typography,
// //   Alert,
// // } from "@mui/material";
// // import api from "../services/api";
// // export default function Contact() {
// //   const [f, setF] = useState({ name: "", email: "", phone: "", message: "" }),
// //     [s, setS] = useState("");
// //   const submit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await api.post("/contacts", f);
// //       setS("success");
// //     } catch {
// //       setS("error");
// //     }
// //   };
// //   return (
// //     <Container maxWidth="md" sx={{ py: 8 }}>
// //       <Typography variant="h3" fontWeight={900} sx={{ mb: 4 }}>
// //         Contact Us
// //       </Typography>
// //       {s && (
// //         <Alert severity={s === "success" ? "success" : "error"}>
// //           {s === "success" ? "Message sent." : "Could not send message."}
// //         </Alert>
// //       )}
// //       <Box component="form" onSubmit={submit}>
// //         {["name", "email", "phone", "message"].map((k) => (
// //           <TextField
// //             key={k}
// //             fullWidth
// //             required={k !== "phone"}
// //             multiline={k === "message"}
// //             rows={k === "message" ? 5 : 1}
// //             label={k.toUpperCase()}
// //             sx={{ my: 1 }}
// //             value={f[k]}
// //             onChange={(e) => setF({ ...f, [k]: e.target.value })}
// //           />
// //         ))}
// //         <Button type="submit" variant="contained" size="large">
// //           Send Message
// //         </Button>
// //       </Box>
// //     </Container>
// //   );
// // }

// import { useState } from "react";
// import {
//   Container,
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Alert,
//   Paper,
//   Grid,
//   CircularProgress,
// } from "@mui/material";
// import { Send, Phone, Email, Person } from "@mui/icons-material";
// import api from "../services/api";

// export default function Contact() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Remove alert when user starts editing again
//     if (status) {
//       setStatus("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setStatus("");

//     try {
//       await api.post("/contacts", form);

//       setStatus("success");

//       setForm({
//         name: "",
//         email: "",
//         phone: "",
//         message: "",
//       });
//     } catch (error) {
//       console.error("Contact form error:", error);
//       setStatus("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "80vh",
//         py: { xs: 5, md: 10 },
//         background: "#0b0b0f",
//       }}
//     >
//       <Container maxWidth="md">
//         {/* Header */}
//         <Box textAlign="center" sx={{ mb: 5 }}>
//           <Typography
//             variant="h3"
//             fontWeight={900}
//             sx={{
//               color: "#fff",
//               mb: 1,
//               fontSize: { xs: "2.2rem", md: "3rem" },
//             }}
//           >
//             Contact <span style={{ color: "#e53935" }}>Us</span>
//           </Typography>

//           <Typography
//             sx={{
//               color: "#aaa",
//               maxWidth: 600,
//               mx: "auto",
//               lineHeight: 1.7,
//             }}
//           >
//             Have a question about our gym, membership, trainers, or programs?
//             Send us a message and our team will get back to you.
//           </Typography>
//         </Box>

//         {/* Form Card */}
//         <Paper
//           elevation={8}
//           sx={{
//             p: { xs: 3, md: 5 },
//             borderRadius: 3,
//             background: "#15151b",
//             border: "1px solid #29292f",
//           }}
//         >
//           {/* Alerts */}
//           {status === "success" && (
//             <Alert
//               severity="success"
//               sx={{
//                 mb: 3,
//                 borderRadius: 2,
//               }}
//             >
//               Your message has been sent successfully. We will contact you soon.
//             </Alert>
//           )}

//           {status === "error" && (
//             <Alert
//               severity="error"
//               sx={{
//                 mb: 3,
//                 borderRadius: 2,
//               }}
//             >
//               Could not send your message. Please try again.
//             </Alert>
//           )}

//           <Box component="form" onSubmit={handleSubmit}>
//             <Grid container spacing={2.5}>
//               {/* Name */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   fullWidth
//                   required
//                   name="name"
//                   label="Full Name"
//                   placeholder="Enter your name"
//                   value={form.name}
//                   onChange={handleChange}
//                   InputProps={{
//                     startAdornment: (
//                       <Person
//                         sx={{
//                           mr: 1,
//                           color: "#e53935",
//                         }}
//                       />
//                     ),
//                   }}
//                   sx={inputStyle}
//                 />
//               </Grid>

//               {/* Email */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   fullWidth
//                   required
//                   type="email"
//                   name="email"
//                   label="Email Address"
//                   placeholder="Enter your email"
//                   value={form.email}
//                   onChange={handleChange}
//                   InputProps={{
//                     startAdornment: (
//                       <Email
//                         sx={{
//                           mr: 1,
//                           color: "#e53935",
//                         }}
//                       />
//                     ),
//                   }}
//                   sx={inputStyle}
//                 />
//               </Grid>

//               {/* Phone */}
//               <Grid size={{ xs: 12 }}>
//                 <TextField
//                   fullWidth
//                   type="tel"
//                   name="phone"
//                   label="Phone Number"
//                   placeholder="Enter your phone number"
//                   value={form.phone}
//                   onChange={handleChange}
//                   inputProps={{
//                     maxLength: 15,
//                   }}
//                   InputProps={{
//                     startAdornment: (
//                       <Phone
//                         sx={{
//                           mr: 1,
//                           color: "#e53935",
//                         }}
//                       />
//                     ),
//                   }}
//                   sx={inputStyle}
//                 />
//               </Grid>

//               {/* Message */}
//               <Grid size={{ xs: 12 }}>
//                 <TextField
//                   fullWidth
//                   required
//                   multiline
//                   rows={6}
//                   name="message"
//                   label="Your Message"
//                   placeholder="Write your message here..."
//                   value={form.message}
//                   onChange={handleChange}
//                   inputProps={{
//                     maxLength: 1000,
//                   }}
//                   helperText={`${form.message.length}/1000 characters`}
//                   sx={inputStyle}
//                 />
//               </Grid>

//               {/* Submit */}
//               <Grid size={{ xs: 12 }}>
//                 <Button
//                   type="submit"
//                   fullWidth
//                   size="large"
//                   variant="contained"
//                   disabled={loading}
//                   startIcon={
//                     loading ? (
//                       <CircularProgress size={20} color="inherit" />
//                     ) : (
//                       <Send />
//                     )
//                   }
//                   sx={{
//                     mt: 1,
//                     py: 1.6,
//                     fontSize: "1rem",
//                     fontWeight: 800,
//                     borderRadius: 2,
//                     background: "#e53935",
//                     "&:hover": {
//                       background: "#c62828",
//                     },
//                     "&:disabled": {
//                       background: "#555",
//                     },
//                   }}
//                 >
//                   {loading ? "Sending..." : "Send Message"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }

// const inputStyle = {
//   "& .MuiInputLabel-root": {
//     color: "#aaa",
//   },

//   "& .MuiInputLabel-root.Mui-focused": {
//     color: "#e53935",
//   },

//   "& .MuiOutlinedInput-root": {
//     color: "#fff",
//     background: "#0f0f14",

//     "& fieldset": {
//       borderColor: "#333",
//     },

//     "&:hover fieldset": {
//       borderColor: "#666",
//     },

//     "&.Mui-focused fieldset": {
//       borderColor: "#e53935",
//     },
//   },

//   "& .MuiFormHelperText-root": {
//     color: "#777",
//   },
// };
