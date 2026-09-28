import React, { useState } from "react";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  CalendarMonth,
  Close,
  Dashboard as DashboardIcon,
  FitnessCenter,
  InfoOutlined,
  KeyboardArrowDown,
  Logout,
  Menu as MenuIcon,
  PersonAdd,
  Person,
  SportsGymnastics,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);

  const accountOpen = Boolean(accountAnchor);

  /*
   * Normalize backend role
   *
   * ADMIN
   * admin
   * ROLE_ADMIN
   *
   * all become ADMIN
   */
  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase();

  const isAdmin = role === "ADMIN";

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenus = () => {
    setAccountAnchor(null);
  };

  const goTo = (path) => {
    closeMenus();
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    closeMenus();
    setMobileOpen(false);

    logout();

    navigate("/", {
      replace: true,
    });
  };

  const handleAccount = (event) => {
    setAccountAnchor(accountAnchor ? null : event.currentTarget);
  };

  const navButtonSx = (active = false) => ({
    position: "relative",

    minWidth: "auto",

    px: 1.8,
    py: 1.2,

    color: active ? "#ffffff" : "#b8b8bf",

    fontSize: 13,
    fontWeight: 800,

    textTransform: "none",

    borderRadius: 2,

    transition: "all .25s ease",

    "&:hover": {
      color: "#ffffff",
      background: "rgba(255,255,255,.045)",
    },

    "&::after": {
      content: '""',

      position: "absolute",

      left: "18%",
      right: "18%",

      bottom: 4,

      height: 2,

      borderRadius: 5,

      background: "linear-gradient(90deg,#e50914,#ff3942)",

      transform: active ? "scaleX(1)" : "scaleX(0)",

      transformOrigin: "center",

      transition: "transform .25s ease",
    },

    "&:hover::after": {
      transform: "scaleX(1)",
    },
  });

  const menuPaperSx = {
    mt: 1.3,

    minWidth: 220,

    borderRadius: 3,

    overflow: "hidden",

    background: "linear-gradient(145deg,#1a1a1f,#0d0d10)",

    border: "1px solid rgba(255,255,255,.08)",

    boxShadow: "0 25px 70px rgba(0,0,0,.6)",

    "& .MuiMenuItem-root": {
      minHeight: 48,
    },
  };

  const menuItemSx = {
    px: 2,
    py: 1.2,

    color: "#c7c7cc",

    fontSize: 13,
    fontWeight: 700,

    transition: "all .2s ease",

    "&:hover": {
      color: "#fff",

      background:
        "linear-gradient(90deg,rgba(229,9,20,.16),rgba(229,9,20,.04))",

      paddingLeft: 2.5,
    },
  };

  return (
    <>
      {/* =========================================================
          APP BAR
      ========================================================= */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(7,7,9,.88)",

          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",

          borderBottom: "1px solid rgba(255,255,255,.07)",

          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 70,
              md: 82,
            },

            px: {
              xs: 2,
              sm: 3,
              md: 5,
              lg: 7,
            },
          }}
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

          <Box
            onClick={() => goTo("/")}
            sx={{
              display: "flex",
              alignItems: "center",

              gap: 1.2,

              cursor: "pointer",

              mr: {
                xs: 0,
                md: 3,
              },
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,

                borderRadius: 2.5,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "linear-gradient(135deg,#ff2631,#a80008)",

                boxShadow: "0 8px 25px rgba(229,9,20,.28)",
              }}
            >
              <FitnessCenter
                sx={{
                  color: "#fff",
                  fontSize: 22,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#fff",

                  fontSize: {
                    xs: 19,
                    md: 22,
                  },

                  fontWeight: 1000,

                  lineHeight: 1,

                  letterSpacing: -0.8,
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

              <Typography
                sx={{
                  color: "#55555c",

                  fontSize: 7,

                  fontWeight: 900,

                  letterSpacing: 2,

                  mt: 0.5,
                }}
              >
                TRAIN • TRANSFORM • DOMINATE
              </Typography>
            </Box>
          </Box>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <Stack
            direction="row"
            alignItems="center"
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },

              flex: 1,
            }}
          >
            {/* HOME */}

            <Button onClick={() => goTo("/")} sx={navButtonSx(isActive("/"))}>
              Home
            </Button>

            {/* ABOUT */}

            <Button
              onClick={() => goTo("/about")}
              startIcon={
                <InfoOutlined
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={navButtonSx(isActive("/about"))}
            >
              About
            </Button>

            {/* =================================================
                PROGRAMS - DIRECT LINK
            ================================================= */}

            <Button
              onClick={() => goTo("/programs")}
              startIcon={
                <FitnessCenter
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={navButtonSx(isActive("/programs"))}
            >
              Programs
            </Button>

            {/* TRAINERS */}

            <Button
              onClick={() => goTo("/trainers")}
              startIcon={
                <SportsGymnastics
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={navButtonSx(isActive("/trainers"))}
            >
              Trainers
            </Button>

            {/* =================================================
                MEMBERSHIPS - DIRECT LINK
            ================================================= */}

            <Button
              onClick={() => goTo("/memberships")}
              startIcon={
                <FitnessCenter
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              sx={navButtonSx(isActive("/memberships"))}
            >
              Memberships
            </Button>

            {/* GALLERY */}

            <Button
              onClick={() => goTo("/gallery")}
              sx={navButtonSx(isActive("/gallery"))}
            >
              Gallery
            </Button>

            {/* CONTACT */}

            <Button
              onClick={() => goTo("/contact")}
              sx={navButtonSx(isActive("/contact"))}
            >
              Contact
            </Button>
          </Stack>

          {/* =====================================================
              DESKTOP ACCOUNT AREA
          ===================================================== */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },
            }}
          >
            {user ? (
              <>
                {/* FREE TRIAL */}

                <Button
                  onClick={() => goTo("/free-trial")}
                  startIcon={<CalendarMonth />}
                  sx={{
                    px: 2,

                    minHeight: 42,

                    borderRadius: 2.5,

                    color: "#fff",

                    fontSize: 12,

                    fontWeight: 900,

                    textTransform: "none",

                    background: "rgba(255,255,255,.045)",

                    border: "1px solid rgba(255,255,255,.08)",

                    "&:hover": {
                      background: "rgba(229,9,20,.12)",

                      borderColor: "rgba(229,9,20,.35)",
                    },
                  }}
                >
                  Free Trial
                </Button>

                {/* ACCOUNT */}

                <Button
                  onClick={handleAccount}
                  startIcon={
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,

                        fontSize: 12,

                        fontWeight: 900,

                        color: "#fff",

                        background: "linear-gradient(135deg,#e50914,#850007)",
                      }}
                    >
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  endIcon={
                    <KeyboardArrowDown
                      sx={{
                        transition: ".25s",

                        transform: accountOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  }
                  sx={{
                    minHeight: 46,

                    px: 1.2,

                    borderRadius: 2.5,

                    color: "#fff",

                    textTransform: "none",

                    background: "rgba(255,255,255,.035)",

                    border: "1px solid rgba(255,255,255,.08)",

                    "&:hover": {
                      background: "rgba(255,255,255,.07)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "left",
                      mr: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#fff",

                        fontSize: 12,

                        fontWeight: 900,

                        lineHeight: 1.1,

                        maxWidth: 100,

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.name || "Account"}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#666",

                        fontSize: 8,

                        fontWeight: 900,

                        letterSpacing: 1,

                        mt: 0.4,
                      }}
                    >
                      {isAdmin ? "ADMIN" : "MEMBER"}
                    </Typography>
                  </Box>
                </Button>

                {/* ACCOUNT MENU */}

                <Menu
                  anchorEl={accountAnchor}
                  open={accountOpen}
                  onClose={closeMenus}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      sx: menuPaperSx,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => goTo(isAdmin ? "/admin" : "/dashboard")}
                    sx={menuItemSx}
                  >
                    <DashboardIcon
                      sx={{
                        mr: 1.5,
                        color: "#e50914",
                      }}
                    />
                    Dashboard
                  </MenuItem>

                  {!isAdmin && (
                    <>
                      <MenuItem
                        onClick={() => goTo("/booking-status")}
                        sx={menuItemSx}
                      >
                        <CalendarMonth
                          sx={{
                            mr: 1.5,
                            color: "#e50914",
                          }}
                        />
                        My Bookings
                      </MenuItem>

                      <MenuItem
                        onClick={() => goTo("/free-trial")}
                        sx={menuItemSx}
                      >
                        <FitnessCenter
                          sx={{
                            mr: 1.5,
                            color: "#e50914",
                          }}
                        />
                        Book Free Trial
                      </MenuItem>
                    </>
                  )}

                  <Divider
                    sx={{
                      borderColor: "rgba(255,255,255,.07)",
                    }}
                  />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      ...menuItemSx,

                      color: "#ff5b63",

                      "&:hover": {
                        color: "#ff777e",

                        background: "rgba(229,9,20,.12)",
                      },
                    }}
                  >
                    <Logout
                      sx={{
                        mr: 1.5,
                        color: "#e50914",
                      }}
                    />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* LOGIN */}

                <Button
                  onClick={() => goTo("/login")}
                  startIcon={<Person />}
                  sx={{
                    minHeight: 44,

                    px: 2,

                    borderRadius: 2.5,

                    color: "#ddd",

                    fontSize: 12,

                    fontWeight: 900,

                    textTransform: "none",

                    "&:hover": {
                      color: "#fff",

                      background: "rgba(255,255,255,.05)",
                    },
                  }}
                >
                  Login
                </Button>

                {/* JOIN */}

                <Button
                  onClick={() => goTo("/register")}
                  startIcon={<PersonAdd />}
                  sx={{
                    minHeight: 44,

                    px: 2.2,

                    borderRadius: 2.5,

                    color: "#fff",

                    fontSize: 12,

                    fontWeight: 900,

                    textTransform: "none",

                    background: "linear-gradient(135deg,#e50914,#9d0008)",

                    boxShadow: "0 8px 24px rgba(229,9,20,.2)",

                    "&:hover": {
                      background: "linear-gradient(135deg,#ff2631,#bd0009)",

                      transform: "translateY(-2px)",

                      boxShadow: "0 12px 30px rgba(229,9,20,.3)",
                    },
                  }}
                >
                  Join Now
                </Button>
              </>
            )}
          </Stack>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}

          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              display: {
                xs: "flex",
                lg: "none",
              },

              ml: "auto",

              width: 44,
              height: 44,

              color: "#fff",

              border: "1px solid rgba(255,255,255,.09)",

              borderRadius: 2.5,

              background: "rgba(255,255,255,.035)",

              "&:hover": {
                background: "rgba(229,9,20,.12)",

                borderColor: "rgba(229,9,20,.35)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* =========================================================
          MOBILE DRAWER
      ========================================================= */}

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: "88%",
              sm: 390,
            },

            maxWidth: 390,

            background: "linear-gradient(160deg,#151519,#08080a)",

            color: "#fff",

            borderLeft: "1px solid rgba(255,255,255,.08)",

            boxShadow: "-25px 0 70px rgba(0,0,0,.55)",
          },
        }}
      >
        {/* DRAWER HEADER */}

        <Box
          sx={{
            px: 2.5,
            py: 2.2,

            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            borderBottom: "1px solid rgba(255,255,255,.07)",
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                borderRadius: 2,

                background: "linear-gradient(135deg,#e50914,#850007)",
              }}
            >
              <FitnessCenter
                sx={{
                  color: "#fff",
                  fontSize: 20,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#fff",

                  fontSize: 18,

                  fontWeight: 1000,

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

              <Typography
                sx={{
                  color: "#555",

                  fontSize: 7,

                  fontWeight: 900,

                  letterSpacing: 1.5,

                  mt: 0.5,
                }}
              >
                FITNESS CLUB
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              color: "#aaa",

              "&:hover": {
                color: "#fff",

                background: "rgba(229,9,20,.12)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <List
          sx={{
            p: 1.5,
          }}
        >
          {/* HOME */}

          <ListItemButton
            onClick={() => goTo("/")}
            sx={{
              ...menuItemSx,

              borderRadius: 2,

              color: isActive("/") ? "#fff" : "#aaa",

              background: isActive("/") ? "rgba(229,9,20,.10)" : "transparent",
            }}
          >
            <ListItemText primary="Home" />
          </ListItemButton>

          {/* ABOUT */}

          <ListItemButton
            onClick={() => goTo("/about")}
            sx={{
              ...menuItemSx,

              borderRadius: 2,

              color: isActive("/about") ? "#fff" : "#aaa",

              background: isActive("/about")
                ? "rgba(229,9,20,.10)"
                : "transparent",
            }}
          >
            <InfoOutlined
              sx={{
                mr: 1.5,

                color: "#e50914",

                fontSize: 20,
              }}
            />

            <ListItemText primary="About" />
          </ListItemButton>

          {/* =================================================
              PROGRAMS - DIRECT LINK
          ================================================= */}

          <ListItemButton
            onClick={() => goTo("/programs")}
            sx={{
              ...menuItemSx,

              borderRadius: 2,

              color: isActive("/programs") ? "#fff" : "#c7c7cc",

              background: isActive("/programs")
                ? "rgba(229,9,20,.10)"
                : "transparent",
            }}
          >
            <FitnessCenter
              sx={{
                mr: 1.5,

                color: "#e50914",

                fontSize: 20,
              }}
            />

            <ListItemText primary="Programs" />
          </ListItemButton>

          {/* TRAINERS */}

          <ListItemButton
            onClick={() => goTo("/trainers")}
            sx={{
              ...menuItemSx,

              borderRadius: 2,

              color: isActive("/trainers") ? "#fff" : "#c7c7cc",

              background: isActive("/trainers")
                ? "rgba(229,9,20,.10)"
                : "transparent",
            }}
          >
            <SportsGymnastics
              sx={{
                mr: 1.5,

                color: "#e50914",

                fontSize: 20,
              }}
            />

            <ListItemText primary="Trainers" />
          </ListItemButton>

          {/* =================================================
              MEMBERSHIPS - DIRECT LINK
          ================================================= */}

          <ListItemButton
            onClick={() => goTo("/memberships")}
            sx={{
              ...menuItemSx,

              borderRadius: 2,

              color: isActive("/memberships") ? "#fff" : "#c7c7cc",

              background: isActive("/memberships")
                ? "rgba(229,9,20,.10)"
                : "transparent",
            }}
          >
            <FitnessCenter
              sx={{
                mr: 1.5,

                color: "#e50914",

                fontSize: 20,
              }}
            />

            <ListItemText primary="Memberships" />
          </ListItemButton>

          {/* GALLERY */}

          <ListItemButton
            onClick={() => goTo("/gallery")}
            sx={{
              ...menuItemSx,

              borderRadius: 2,

              color: isActive("/gallery") ? "#fff" : "#c7c7cc",

              background: isActive("/gallery")
                ? "rgba(229,9,20,.10)"
                : "transparent",
            }}
          >
            <ListItemText primary="Gallery" />
          </ListItemButton>

          {/* CONTACT */}

          <ListItemButton
            onClick={() => goTo("/contact")}
            sx={{
              ...menuItemSx,

              borderRadius: 2,

              color: isActive("/contact") ? "#fff" : "#c7c7cc",

              background: isActive("/contact")
                ? "rgba(229,9,20,.10)"
                : "transparent",
            }}
          >
            <ListItemText primary="Contact" />
          </ListItemButton>

          <Divider
            sx={{
              my: 2,

              borderColor: "rgba(255,255,255,.07)",
            }}
          />

          {/* =====================================================
              AUTHENTICATED MOBILE AREA
          ===================================================== */}

          {user ? (
            <>
              {/* USER CARD */}

              <Box
                sx={{
                  mx: 1,

                  mb: 1.5,

                  p: 1.5,

                  borderRadius: 3,

                  background: "rgba(255,255,255,.035)",

                  border: "1px solid rgba(255,255,255,.07)",
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,

                      fontWeight: 900,

                      background: "linear-gradient(135deg,#e50914,#850007)",
                    }}
                  >
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </Avatar>

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#fff",

                        fontWeight: 900,

                        fontSize: 13,
                      }}
                    >
                      {user.name || "User"}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#666",

                        fontSize: 10,

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#e50914",

                        fontSize: 8,

                        fontWeight: 900,

                        letterSpacing: 1,

                        mt: 0.3,
                      }}
                    >
                      {isAdmin ? "ADMIN" : "MEMBER"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* DASHBOARD */}

              <ListItemButton
                onClick={() => goTo(isAdmin ? "/admin" : "/dashboard")}
                sx={{
                  ...menuItemSx,

                  borderRadius: 2,
                }}
              >
                <DashboardIcon
                  sx={{
                    mr: 1.5,

                    color: "#e50914",
                  }}
                />

                <ListItemText primary="Dashboard" />
              </ListItemButton>

              {!isAdmin && (
                <>
                  {/* BOOKINGS */}

                  <ListItemButton
                    onClick={() => goTo("/booking-status")}
                    sx={{
                      ...menuItemSx,

                      borderRadius: 2,
                    }}
                  >
                    <CalendarMonth
                      sx={{
                        mr: 1.5,

                        color: "#e50914",
                      }}
                    />

                    <ListItemText primary="My Bookings" />
                  </ListItemButton>

                  {/* FREE TRIAL */}

                  <ListItemButton
                    onClick={() => goTo("/free-trial")}
                    sx={{
                      ...menuItemSx,

                      borderRadius: 2,
                    }}
                  >
                    <FitnessCenter
                      sx={{
                        mr: 1.5,

                        color: "#e50914",
                      }}
                    />

                    <ListItemText primary="Book Free Trial" />
                  </ListItemButton>
                </>
              )}

              {/* LOGOUT */}

              <ListItemButton
                onClick={handleLogout}
                sx={{
                  ...menuItemSx,

                  borderRadius: 2,

                  color: "#ff5b63",

                  "&:hover": {
                    color: "#fff",

                    background: "rgba(229,9,20,.12)",
                  },
                }}
              >
                <Logout
                  sx={{
                    mr: 1.5,

                    color: "#e50914",
                  }}
                />

                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          ) : (
            <>
              {/* LOGIN */}

              <ListItemButton
                onClick={() => goTo("/login")}
                sx={{
                  ...menuItemSx,

                  borderRadius: 2,
                }}
              >
                <Person
                  sx={{
                    mr: 1.5,

                    color: "#e50914",
                  }}
                />

                <ListItemText primary="Login" />
              </ListItemButton>

              {/* JOIN NOW */}

              <Button
                fullWidth
                onClick={() => goTo("/register")}
                startIcon={<PersonAdd />}
                sx={{
                  mt: 1.5,

                  minHeight: 50,

                  borderRadius: 2.5,

                  color: "#fff",

                  fontSize: 13,

                  fontWeight: 900,

                  textTransform: "none",

                  background: "linear-gradient(135deg,#e50914,#9d0008)",

                  "&:hover": {
                    background: "linear-gradient(135deg,#ff2631,#bd0009)",
                  },
                }}
              >
                Join Now
              </Button>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}

// import React, { useState } from "react";

// import {
//   AppBar,
//   Avatar,
//   Box,
//   Button,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemText,
//   Menu,
//   MenuItem,
//   Stack,
//   Toolbar,
//   Typography,
// } from "@mui/material";

// import {
//   AccountCircle,
//   CalendarMonth,
//   Close,
//   Dashboard as DashboardIcon,
//   FitnessCenter,
//   KeyboardArrowDown,
//   Logout,
//   Menu as MenuIcon,
//   PersonAdd,
//   Person,
//   SportsGymnastics,
// } from "@mui/icons-material";

// import { useLocation, useNavigate } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { user, logout } = useAuth();

//   const [mobileOpen, setMobileOpen] = useState(false);

//   const [programAnchor, setProgramAnchor] = useState(null);
//   const [membershipAnchor, setMembershipAnchor] = useState(null);
//   const [accountAnchor, setAccountAnchor] = useState(null);

//   const programOpen = Boolean(programAnchor);
//   const membershipOpen = Boolean(membershipAnchor);
//   const accountOpen = Boolean(accountAnchor);

//   /*
//    * Normalize backend role.
//    *
//    * ADMIN
//    * admin
//    * ROLE_ADMIN
//    *
//    * all become ADMIN
//    */
//   const role = String(user?.role || "")
//     .replace("ROLE_", "")
//     .toUpperCase();

//   const isAdmin = role === "ADMIN";

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const goTo = (path) => {
//     closeMenus();
//     setMobileOpen(false);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     closeMenus();
//     setMobileOpen(false);

//     logout();

//     navigate("/", {
//       replace: true,
//     });
//   };

//   const closeMenus = () => {
//     setProgramAnchor(null);
//     setMembershipAnchor(null);
//     setAccountAnchor(null);
//   };

//   const handlePrograms = (event) => {
//     setMembershipAnchor(null);
//     setAccountAnchor(null);

//     setProgramAnchor(programAnchor ? null : event.currentTarget);
//   };

//   const handleMemberships = (event) => {
//     setProgramAnchor(null);
//     setAccountAnchor(null);

//     setMembershipAnchor(membershipAnchor ? null : event.currentTarget);
//   };

//   const handleAccount = (event) => {
//     setProgramAnchor(null);
//     setMembershipAnchor(null);

//     setAccountAnchor(accountAnchor ? null : event.currentTarget);
//   };

//   const programs = [
//     {
//       name: "Strength Training",
//       path: "/programs",
//     },
//     {
//       name: "Cardio Training",
//       path: "/programs",
//     },
//     {
//       name: "Yoga & Flexibility",
//       path: "/programs",
//     },
//     {
//       name: "CrossFit",
//       path: "/programs",
//     },
//   ];

//   const memberships = [
//     {
//       name: "Basic",
//       path: "/memberships",
//     },
//     {
//       name: "Premium",
//       path: "/memberships",
//     },
//     {
//       name: "Elite",
//       path: "/memberships",
//     },
//   ];

//   const navButtonSx = (active = false) => ({
//     position: "relative",
//     minWidth: "auto",
//     px: 1.8,
//     py: 1.2,
//     color: active ? "#ffffff" : "#b8b8bf",
//     fontSize: 13,
//     fontWeight: 800,
//     textTransform: "none",
//     borderRadius: 2,
//     transition: "all .25s ease",

//     "&:hover": {
//       color: "#ffffff",
//       background: "rgba(255,255,255,.045)",
//     },

//     "&::after": {
//       content: '""',
//       position: "absolute",
//       left: "18%",
//       right: "18%",
//       bottom: 4,
//       height: 2,
//       borderRadius: 5,
//       background: "linear-gradient(90deg,#e50914,#ff3942)",
//       transform: active ? "scaleX(1)" : "scaleX(0)",
//       transformOrigin: "center",
//       transition: "transform .25s ease",
//     },

//     "&:hover::after": {
//       transform: "scaleX(1)",
//     },
//   });

//   const menuPaperSx = {
//     mt: 1.3,
//     minWidth: 220,
//     borderRadius: 3,
//     overflow: "hidden",

//     background: "linear-gradient(145deg,#1a1a1f,#0d0d10)",

//     border: "1px solid rgba(255,255,255,.08)",

//     boxShadow: "0 25px 70px rgba(0,0,0,.6)",

//     "& .MuiMenuItem-root": {
//       minHeight: 48,
//     },
//   };

//   const menuItemSx = {
//     px: 2,
//     py: 1.2,
//     color: "#c7c7cc",
//     fontSize: 13,
//     fontWeight: 700,

//     transition: "all .2s ease",

//     "&:hover": {
//       color: "#fff",
//       background:
//         "linear-gradient(90deg,rgba(229,9,20,.16),rgba(229,9,20,.04))",
//       paddingLeft: 2.5,
//     },
//   };

//   return (
//     <>
//       <AppBar
//         position="sticky"
//         elevation={0}
//         sx={{
//           background: "rgba(7,7,9,.88)",

//           backdropFilter: "blur(20px)",
//           WebkitBackdropFilter: "blur(20px)",

//           borderBottom: "1px solid rgba(255,255,255,.07)",

//           zIndex: 1200,
//         }}
//       >
//         <Toolbar
//           sx={{
//             minHeight: {
//               xs: 70,
//               md: 82,
//             },

//             px: {
//               xs: 2,
//               sm: 3,
//               md: 5,
//               lg: 7,
//             },
//           }}
//         >
//           {/* LOGO */}
//           <Box
//             onClick={() => goTo("/")}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.2,
//               cursor: "pointer",
//               mr: {
//                 xs: 0,
//                 md: 3,
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 width: 42,
//                 height: 42,
//                 borderRadius: 2.5,

//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",

//                 background: "linear-gradient(135deg,#ff2631,#a80008)",

//                 boxShadow: "0 8px 25px rgba(229,9,20,.28)",
//               }}
//             >
//               <FitnessCenter
//                 sx={{
//                   color: "#fff",
//                   fontSize: 22,
//                 }}
//               />
//             </Box>

//             <Box>
//               <Typography
//                 sx={{
//                   color: "#fff",
//                   fontSize: {
//                     xs: 19,
//                     md: 22,
//                   },
//                   fontWeight: 1000,
//                   lineHeight: 1,
//                   letterSpacing: -0.8,
//                 }}
//               >
//                 FIT
//                 <Box
//                   component="span"
//                   sx={{
//                     color: "#e50914",
//                   }}
//                 >
//                   NESS
//                 </Box>
//               </Typography>

//               <Typography
//                 sx={{
//                   color: "#55555c",
//                   fontSize: 7,
//                   fontWeight: 900,
//                   letterSpacing: 2,
//                   mt: 0.5,
//                 }}
//               >
//                 TRAIN • TRANSFORM • DOMINATE
//               </Typography>
//             </Box>
//           </Box>

//           {/* DESKTOP NAV */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             sx={{
//               display: {
//                 xs: "none",
//                 lg: "flex",
//               },

//               flex: 1,
//             }}
//           >
//             <Button onClick={() => goTo("/")} sx={navButtonSx(isActive("/"))}>
//               Home
//             </Button>

//             {/* PROGRAMS */}
//             <Button
//               onClick={handlePrograms}
//               endIcon={
//                 <KeyboardArrowDown
//                   sx={{
//                     transition: ".25s",
//                     transform: programOpen ? "rotate(180deg)" : "rotate(0deg)",
//                   }}
//                 />
//               }
//               sx={navButtonSx(location.pathname === "/programs")}
//             >
//               Programs
//             </Button>

//             <Menu
//               anchorEl={programAnchor}
//               open={programOpen}
//               onClose={closeMenus}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "left",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "left",
//               }}
//               slotProps={{
//                 paper: {
//                   sx: menuPaperSx,
//                 },
//               }}
//             >
//               {programs.map((program) => (
//                 <MenuItem
//                   key={program.name}
//                   onClick={() => goTo(program.path)}
//                   sx={menuItemSx}
//                 >
//                   <FitnessCenter
//                     sx={{
//                       mr: 1.5,
//                       fontSize: 18,
//                       color: "#e50914",
//                     }}
//                   />

//                   {program.name}
//                 </MenuItem>
//               ))}
//             </Menu>

//             <Button
//               onClick={() => goTo("/trainers")}
//               sx={navButtonSx(isActive("/trainers"))}
//             >
//               Trainers
//             </Button>

//             {/* MEMBERSHIPS */}
//             <Button
//               onClick={handleMemberships}
//               endIcon={
//                 <KeyboardArrowDown
//                   sx={{
//                     transition: ".25s",
//                     transform: membershipOpen
//                       ? "rotate(180deg)"
//                       : "rotate(0deg)",
//                   }}
//                 />
//               }
//               sx={navButtonSx(location.pathname === "/memberships")}
//             >
//               Memberships
//             </Button>

//             <Menu
//               anchorEl={membershipAnchor}
//               open={membershipOpen}
//               onClose={closeMenus}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "left",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "left",
//               }}
//               slotProps={{
//                 paper: {
//                   sx: menuPaperSx,
//                 },
//               }}
//             >
//               {memberships.map((membership) => (
//                 <MenuItem
//                   key={membership.name}
//                   onClick={() => goTo(membership.path)}
//                   sx={menuItemSx}
//                 >
//                   <SportsGymnastics
//                     sx={{
//                       mr: 1.5,
//                       fontSize: 18,
//                       color: "#e50914",
//                     }}
//                   />

//                   {membership.name}
//                 </MenuItem>
//               ))}
//             </Menu>

//             <Button
//               onClick={() => goTo("/gallery")}
//               sx={navButtonSx(isActive("/gallery"))}
//             >
//               Gallery
//             </Button>

//             <Button
//               onClick={() => goTo("/contact")}
//               sx={navButtonSx(isActive("/contact"))}
//             >
//               Contact
//             </Button>
//           </Stack>

//           {/* DESKTOP ACCOUNT AREA */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={1}
//             sx={{
//               display: {
//                 xs: "none",
//                 lg: "flex",
//               },
//             }}
//           >
//             {user ? (
//               <>
//                 {/* FREE TRIAL */}
//                 <Button
//                   onClick={() => goTo("/free-trial")}
//                   startIcon={<CalendarMonth />}
//                   sx={{
//                     px: 2,
//                     minHeight: 42,
//                     borderRadius: 2.5,

//                     color: "#fff",
//                     fontSize: 12,
//                     fontWeight: 900,
//                     textTransform: "none",

//                     background: "rgba(255,255,255,.045)",

//                     border: "1px solid rgba(255,255,255,.08)",

//                     "&:hover": {
//                       background: "rgba(229,9,20,.12)",
//                       borderColor: "rgba(229,9,20,.35)",
//                     },
//                   }}
//                 >
//                   Free Trial
//                 </Button>

//                 {/* ACCOUNT */}
//                 <Button
//                   onClick={handleAccount}
//                   startIcon={
//                     <Avatar
//                       sx={{
//                         width: 28,
//                         height: 28,
//                         fontSize: 12,
//                         fontWeight: 900,
//                         color: "#fff",
//                         background: "linear-gradient(135deg,#e50914,#850007)",
//                       }}
//                     >
//                       {(user.name || user.email || "U").charAt(0).toUpperCase()}
//                     </Avatar>
//                   }
//                   endIcon={
//                     <KeyboardArrowDown
//                       sx={{
//                         transition: ".25s",
//                         transform: accountOpen
//                           ? "rotate(180deg)"
//                           : "rotate(0deg)",
//                       }}
//                     />
//                   }
//                   sx={{
//                     minHeight: 46,
//                     px: 1.2,
//                     borderRadius: 2.5,
//                     color: "#fff",
//                     textTransform: "none",
//                     background: "rgba(255,255,255,.035)",
//                     border: "1px solid rgba(255,255,255,.08)",

//                     "&:hover": {
//                       background: "rgba(255,255,255,.07)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       textAlign: "left",
//                       mr: 0.5,
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         color: "#fff",
//                         fontSize: 12,
//                         fontWeight: 900,
//                         lineHeight: 1.1,
//                         maxWidth: 100,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {user.name || "Account"}
//                     </Typography>

//                     <Typography
//                       sx={{
//                         color: "#666",
//                         fontSize: 8,
//                         fontWeight: 900,
//                         letterSpacing: 1,
//                         mt: 0.4,
//                       }}
//                     >
//                       {isAdmin ? "ADMIN" : "MEMBER"}
//                     </Typography>
//                   </Box>
//                 </Button>

//                 <Menu
//                   anchorEl={accountAnchor}
//                   open={accountOpen}
//                   onClose={closeMenus}
//                   anchorOrigin={{
//                     vertical: "bottom",
//                     horizontal: "right",
//                   }}
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   slotProps={{
//                     paper: {
//                       sx: menuPaperSx,
//                     },
//                   }}
//                 >
//                   <MenuItem
//                     onClick={() => goTo(isAdmin ? "/admin" : "/dashboard")}
//                     sx={menuItemSx}
//                   >
//                     <DashboardIcon
//                       sx={{
//                         mr: 1.5,
//                         color: "#e50914",
//                       }}
//                     />
//                     Dashboard
//                   </MenuItem>

//                   {!isAdmin && (
//                     <>
//                       <MenuItem
//                         onClick={() => goTo("/booking-status")}
//                         sx={menuItemSx}
//                       >
//                         <CalendarMonth
//                           sx={{
//                             mr: 1.5,
//                             color: "#e50914",
//                           }}
//                         />
//                         My Bookings
//                       </MenuItem>

//                       <MenuItem
//                         onClick={() => goTo("/free-trial")}
//                         sx={menuItemSx}
//                       >
//                         <FitnessCenter
//                           sx={{
//                             mr: 1.5,
//                             color: "#e50914",
//                           }}
//                         />
//                         Book Free Trial
//                       </MenuItem>
//                     </>
//                   )}

//                   <Divider
//                     sx={{
//                       borderColor: "rgba(255,255,255,.07)",
//                     }}
//                   />

//                   <MenuItem
//                     onClick={handleLogout}
//                     sx={{
//                       ...menuItemSx,
//                       color: "#ff5b63",

//                       "&:hover": {
//                         color: "#ff777e",
//                         background: "rgba(229,9,20,.12)",
//                       },
//                     }}
//                   >
//                     <Logout
//                       sx={{
//                         mr: 1.5,
//                         color: "#e50914",
//                       }}
//                     />
//                     Logout
//                   </MenuItem>
//                 </Menu>
//               </>
//             ) : (
//               <>
//                 <Button
//                   onClick={() => goTo("/login")}
//                   startIcon={<Person />}
//                   sx={{
//                     minHeight: 44,
//                     px: 2,
//                     borderRadius: 2.5,
//                     color: "#ddd",
//                     fontSize: 12,
//                     fontWeight: 900,
//                     textTransform: "none",

//                     "&:hover": {
//                       color: "#fff",
//                       background: "rgba(255,255,255,.05)",
//                     },
//                   }}
//                 >
//                   Login
//                 </Button>

//                 <Button
//                   onClick={() => goTo("/register")}
//                   startIcon={<PersonAdd />}
//                   sx={{
//                     minHeight: 44,
//                     px: 2.2,
//                     borderRadius: 2.5,

//                     color: "#fff",
//                     fontSize: 12,
//                     fontWeight: 900,
//                     textTransform: "none",

//                     background: "linear-gradient(135deg,#e50914,#9d0008)",

//                     boxShadow: "0 8px 24px rgba(229,9,20,.2)",

//                     "&:hover": {
//                       background: "linear-gradient(135deg,#ff2631,#bd0009)",

//                       transform: "translateY(-2px)",

//                       boxShadow: "0 12px 30px rgba(229,9,20,.3)",
//                     },
//                   }}
//                 >
//                   Join Now
//                 </Button>
//               </>
//             )}
//           </Stack>

//           {/* MOBILE BUTTON */}
//           <IconButton
//             onClick={() => setMobileOpen(true)}
//             sx={{
//               display: {
//                 xs: "flex",
//                 lg: "none",
//               },

//               ml: "auto",

//               width: 44,
//               height: 44,

//               color: "#fff",

//               border: "1px solid rgba(255,255,255,.09)",

//               borderRadius: 2.5,

//               background: "rgba(255,255,255,.035)",

//               "&:hover": {
//                 background: "rgba(229,9,20,.12)",
//                 borderColor: "rgba(229,9,20,.35)",
//               },
//             }}
//           >
//             <MenuIcon />
//           </IconButton>
//         </Toolbar>
//       </AppBar>

//       {/* MOBILE DRAWER */}
//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={() => setMobileOpen(false)}
//         PaperProps={{
//           sx: {
//             width: {
//               xs: "88%",
//               sm: 390,
//             },

//             maxWidth: 390,

//             background: "linear-gradient(160deg,#151519,#08080a)",

//             color: "#fff",

//             borderLeft: "1px solid rgba(255,255,255,.08)",

//             boxShadow: "-25px 0 70px rgba(0,0,0,.55)",
//           },
//         }}
//       >
//         {/* DRAWER HEADER */}
//         <Box
//           sx={{
//             px: 2.5,
//             py: 2.2,

//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",

//             borderBottom: "1px solid rgba(255,255,255,.07)",
//           }}
//         >
//           <Stack direction="row" spacing={1.2} alignItems="center">
//             <Box
//               sx={{
//                 width: 38,
//                 height: 38,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 borderRadius: 2,

//                 background: "linear-gradient(135deg,#e50914,#850007)",
//               }}
//             >
//               <FitnessCenter
//                 sx={{
//                   color: "#fff",
//                   fontSize: 20,
//                 }}
//               />
//             </Box>

//             <Box>
//               <Typography
//                 sx={{
//                   color: "#fff",
//                   fontSize: 18,
//                   fontWeight: 1000,
//                   lineHeight: 1,
//                 }}
//               >
//                 FIT
//                 <Box component="span" sx={{ color: "#e50914" }}>
//                   NESS
//                 </Box>
//               </Typography>

//               <Typography
//                 sx={{
//                   color: "#555",
//                   fontSize: 7,
//                   fontWeight: 900,
//                   letterSpacing: 1.5,
//                   mt: 0.5,
//                 }}
//               >
//                 FITNESS CLUB
//               </Typography>
//             </Box>
//           </Stack>

//           <IconButton
//             onClick={() => setMobileOpen(false)}
//             sx={{
//               color: "#aaa",

//               "&:hover": {
//                 color: "#fff",
//                 background: "rgba(229,9,20,.12)",
//               },
//             }}
//           >
//             <Close />
//           </IconButton>
//         </Box>

//         <List
//           sx={{
//             p: 1.5,
//           }}
//         >
//           {/* HOME */}
//           <ListItemButton
//             onClick={() => goTo("/")}
//             sx={{
//               ...menuItemSx,
//               borderRadius: 2,
//               color: isActive("/") ? "#fff" : "#aaa",
//               background: isActive("/") ? "rgba(229,9,20,.10)" : "transparent",
//             }}
//           >
//             <ListItemText primary="Home" />
//           </ListItemButton>

//           {/* PROGRAMS */}
//           <ListItemButton
//             onClick={() => goTo("/programs")}
//             sx={{
//               ...menuItemSx,
//               borderRadius: 2,
//             }}
//           >
//             <FitnessCenter
//               sx={{
//                 mr: 1.5,
//                 color: "#e50914",
//                 fontSize: 20,
//               }}
//             />

//             <ListItemText primary="Programs" />
//           </ListItemButton>

//           {programs.map((program) => (
//             <ListItemButton
//               key={program.name}
//               onClick={() => goTo(program.path)}
//               sx={{
//                 pl: 5,
//                 borderRadius: 2,
//                 color: "#777",
//                 fontSize: 12,

//                 "&:hover": {
//                   color: "#fff",
//                   background: "rgba(229,9,20,.08)",
//                 },
//               }}
//             >
//               <ListItemText primary={program.name} />
//             </ListItemButton>
//           ))}

//           {/* TRAINERS */}
//           <ListItemButton
//             onClick={() => goTo("/trainers")}
//             sx={{
//               ...menuItemSx,
//               borderRadius: 2,
//             }}
//           >
//             <SportsGymnastics
//               sx={{
//                 mr: 1.5,
//                 color: "#e50914",
//                 fontSize: 20,
//               }}
//             />

//             <ListItemText primary="Trainers" />
//           </ListItemButton>

//           {/* MEMBERSHIPS */}
//           <ListItemButton
//             onClick={() => goTo("/memberships")}
//             sx={{
//               ...menuItemSx,
//               borderRadius: 2,
//             }}
//           >
//             <FitnessCenter
//               sx={{
//                 mr: 1.5,
//                 color: "#e50914",
//                 fontSize: 20,
//               }}
//             />

//             <ListItemText primary="Memberships" />
//           </ListItemButton>

//           {memberships.map((membership) => (
//             <ListItemButton
//               key={membership.name}
//               onClick={() => goTo(membership.path)}
//               sx={{
//                 pl: 5,
//                 borderRadius: 2,
//                 color: "#777",
//                 fontSize: 12,

//                 "&:hover": {
//                   color: "#fff",
//                   background: "rgba(229,9,20,.08)",
//                 },
//               }}
//             >
//               <ListItemText primary={membership.name} />
//             </ListItemButton>
//           ))}

//           {/* GALLERY */}
//           <ListItemButton
//             onClick={() => goTo("/gallery")}
//             sx={{
//               ...menuItemSx,
//               borderRadius: 2,
//             }}
//           >
//             <ListItemText primary="Gallery" />
//           </ListItemButton>

//           {/* CONTACT */}
//           <ListItemButton
//             onClick={() => goTo("/contact")}
//             sx={{
//               ...menuItemSx,
//               borderRadius: 2,
//             }}
//           >
//             <ListItemText primary="Contact" />
//           </ListItemButton>

//           <Divider
//             sx={{
//               my: 2,
//               borderColor: "rgba(255,255,255,.07)",
//             }}
//           />

//           {/* AUTHENTICATED */}
//           {user ? (
//             <>
//               <Box
//                 sx={{
//                   mx: 1,
//                   mb: 1.5,
//                   p: 1.5,
//                   borderRadius: 3,

//                   background: "rgba(255,255,255,.035)",

//                   border: "1px solid rgba(255,255,255,.07)",
//                 }}
//               >
//                 <Stack direction="row" spacing={1.2} alignItems="center">
//                   <Avatar
//                     sx={{
//                       width: 42,
//                       height: 42,
//                       fontWeight: 900,

//                       background: "linear-gradient(135deg,#e50914,#850007)",
//                     }}
//                   >
//                     {(user.name || user.email || "U").charAt(0).toUpperCase()}
//                   </Avatar>

//                   <Box sx={{ minWidth: 0 }}>
//                     <Typography
//                       sx={{
//                         color: "#fff",
//                         fontWeight: 900,
//                         fontSize: 13,
//                       }}
//                     >
//                       {user.name || "User"}
//                     </Typography>

//                     <Typography
//                       sx={{
//                         color: "#666",
//                         fontSize: 10,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {user.email}
//                     </Typography>
//                   </Box>
//                 </Stack>
//               </Box>

//               <ListItemButton
//                 onClick={() => goTo(isAdmin ? "/admin" : "/dashboard")}
//                 sx={{
//                   ...menuItemSx,
//                   borderRadius: 2,
//                 }}
//               >
//                 <DashboardIcon
//                   sx={{
//                     mr: 1.5,
//                     color: "#e50914",
//                   }}
//                 />

//                 <ListItemText primary="Dashboard" />
//               </ListItemButton>

//               {!isAdmin && (
//                 <>
//                   <ListItemButton
//                     onClick={() => goTo("/booking-status")}
//                     sx={{
//                       ...menuItemSx,
//                       borderRadius: 2,
//                     }}
//                   >
//                     <CalendarMonth
//                       sx={{
//                         mr: 1.5,
//                         color: "#e50914",
//                       }}
//                     />

//                     <ListItemText primary="My Bookings" />
//                   </ListItemButton>

//                   <ListItemButton
//                     onClick={() => goTo("/free-trial")}
//                     sx={{
//                       ...menuItemSx,
//                       borderRadius: 2,
//                     }}
//                   >
//                     <FitnessCenter
//                       sx={{
//                         mr: 1.5,
//                         color: "#e50914",
//                       }}
//                     />

//                     <ListItemText primary="Book Free Trial" />
//                   </ListItemButton>
//                 </>
//               )}

//               <ListItemButton
//                 onClick={handleLogout}
//                 sx={{
//                   ...menuItemSx,
//                   borderRadius: 2,
//                   color: "#ff5b63",

//                   "&:hover": {
//                     color: "#fff",
//                     background: "rgba(229,9,20,.12)",
//                   },
//                 }}
//               >
//                 <Logout
//                   sx={{
//                     mr: 1.5,
//                     color: "#e50914",
//                   }}
//                 />

//                 <ListItemText primary="Logout" />
//               </ListItemButton>
//             </>
//           ) : (
//             <>
//               <ListItemButton
//                 onClick={() => goTo("/login")}
//                 sx={{
//                   ...menuItemSx,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Person
//                   sx={{
//                     mr: 1.5,
//                     color: "#e50914",
//                   }}
//                 />

//                 <ListItemText primary="Login" />
//               </ListItemButton>

//               <Button
//                 fullWidth
//                 onClick={() => goTo("/register")}
//                 startIcon={<PersonAdd />}
//                 sx={{
//                   mt: 1.5,
//                   minHeight: 50,
//                   borderRadius: 2.5,

//                   color: "#fff",
//                   fontSize: 13,
//                   fontWeight: 900,
//                   textTransform: "none",

//                   background: "linear-gradient(135deg,#e50914,#9d0008)",

//                   "&:hover": {
//                     background: "linear-gradient(135deg,#ff2631,#bd0009)",
//                   },
//                 }}
//               >
//                 Join Now
//               </Button>
//             </>
//           )}
//         </List>
//       </Drawer>
//     </>
//   );
// }
