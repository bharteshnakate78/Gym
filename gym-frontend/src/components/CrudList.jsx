import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import api from "../services/api";
import SectionTitle from "../components/SectionTitle";

export default function CrudList({ endpoint, title, render }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(endpoint);

        console.log(`${endpoint} response:`, response.data);

        if (mounted) {
          setData(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error(`${endpoint} error:`, err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.response?.data?.error ||
              "Unable to load data. Check the backend.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [endpoint]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 5, md: 8 },
        background:
          "radial-gradient(circle at 10% 10%, rgba(229,9,20,0.08), transparent 28%), radial-gradient(circle at 90% 20%, rgba(229,9,20,0.06), transparent 25%), #08080a",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        {/* =====================================
            SECTION TITLE
        ====================================== */}

        {title && (
          <Box
            sx={{
              mb: { xs: 4, md: 6 },
              textAlign: "center",
            }}
          >
            <SectionTitle eyebrow="FITNESS CLUB" title={title} />
          </Box>
        )}

        {/* =====================================
            LOADING
        ====================================== */}

        {loading && (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress
              size={48}
              thickness={4}
              sx={{
                color: "#e50914",
              }}
            />

            <Typography
              sx={{
                color: "#666",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              LOADING...
            </Typography>
          </Box>
        )}

        {/* =====================================
            ERROR
        ====================================== */}

        {!loading && error && (
          <Box
            sx={{
              maxWidth: 700,
              mx: "auto",
            }}
          >
            <Alert
              severity="error"
              sx={{
                background: "rgba(229,9,20,0.08)",
                color: "#ff6b72",
                border: "1px solid rgba(229,9,20,0.25)",
                borderRadius: 3,

                "& .MuiAlert-icon": {
                  color: "#e50914",
                },
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* =====================================
            EMPTY
        ====================================== */}

        {!loading && !error && !data.length && (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 3,
            }}
          >
            <Box
              sx={{
                p: 5,
                borderRadius: 4,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                maxWidth: 500,
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 900,
                  mb: 1,
                }}
              >
                Nothing here yet
              </Typography>

              <Typography
                sx={{
                  color: "#666",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                No data is available at the moment. Please check back later.
              </Typography>
            </Box>
          </Box>
        )}

        {/* =====================================
            DATA GRID
        ====================================== */}

        {!loading && !error && data.length > 0 && (
          <Grid
            container
            spacing={{ xs: 2.5, sm: 3, md: 3.5 }}
            sx={{
              alignItems: "stretch",
            }}
          >
            {data.map((item, index) => (
              <Grid
                key={item.id ?? index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
                sx={{
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                  }}
                >
                  {render(item)}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

// import { useEffect, useState } from "react";

// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Alert,
// } from "@mui/material";

// import api from "../services/api";
// import SectionTitle from "../components/SectionTitle";

// export default function CrudList({ endpoint, title, render }) {
//   const [d, setD] = useState([]);
//   const [e, setE] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     setE("");

//     api
//       .get(endpoint)
//       .then((response) => {
//         console.log(`${endpoint} response:`, response.data);

//         setD(response.data);
//       })
//       .catch((error) => {
//         console.error(`${endpoint} error:`, error);

//         setE(
//           error.response?.data?.message ||
//             "Unable to load data. Check the backend.",
//         );
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [endpoint]);

//   return (
//     <Container sx={{ py: 8 }}>
//       <SectionTitle eyebrow="FITNESS CLUB" title={title} />

//       {loading ? (
//         <CircularProgress
//           sx={{
//             display: "block",
//             mx: "auto",
//             mt: 5,
//           }}
//         />
//       ) : e ? (
//         <Alert severity="error">{e}</Alert>
//       ) : !d.length ? (
//         <Typography textAlign="center" color="text.secondary">
//           No data available yet.
//         </Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {d.map((x) => (
//             <Grid
//               size={{
//                 xs: 12,
//                 sm: 6,
//                 md: 4,
//               }}
//               key={x.id}
//             >
//               {render(x)}
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Container>
//   );
// }
