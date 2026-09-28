import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ff3d3d" },
    secondary: { main: "#ffb300" },
    background: { default: "#09090b", paper: "#151518" },
  },
  shape: { borderRadius: 14 },
  typography: { fontFamily: "Inter,Arial,sans-serif" },
});
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
