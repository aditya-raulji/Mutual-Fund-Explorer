"use client";

import React from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export const ThemeControllerContext = React.createContext({
  primaryColor: "#6C47FF",
  setPrimaryColor: () => {},
  mode: "light",
  toggleMode: () => {},
});

function buildTheme(primaryColor, mode) {
  const isDark = mode === "dark";
  
  return createTheme({
    palette: {
      mode,
      primary: { 
        main: primaryColor,
        light: `${primaryColor}20`,
        dark: `${primaryColor}CC`,
      },
      secondary: {
        main: isDark ? "#f093fb" : "#667eea",
        light: isDark ? "#f093fb40" : "#667eea40",
        dark: isDark ? "#f093fbCC" : "#667eeaCC",
      },
      background: {
        default: isDark ? "#0a0a0f" : "#f8fafc",
        paper: isDark ? "#111118" : "#ffffff",
        glass: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.1)",
      },
      text: {
        primary: isDark ? "#ffffff" : "#1a202c",
        secondary: isDark ? "#a0aec0" : "#4a5568",
      },
      success: {
        main: "#4facfe",
        light: "#4facfe40",
        dark: "#00f2fe",
      },
      warning: {
        main: "#43e97b",
        light: "#43e97b40",
        dark: "#38f9d7",
      },
      error: {
        main: "#f5576c",
        light: "#f5576c40",
        dark: "#f093fb",
      },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: "var(--font-geist-sans), Inter, system-ui, Arial",
      h1: { 
        fontWeight: 800,
        fontSize: "3.5rem",
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      },
      h2: { 
        fontWeight: 800,
        fontSize: "2.5rem",
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      h3: { 
        fontWeight: 800,
        fontSize: "2rem",
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 700,
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 700,
        fontSize: "1.25rem",
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 700,
        fontSize: "1.125rem",
        lineHeight: 1.5,
      },
      button: { 
        textTransform: "none", 
        fontWeight: 600,
        fontSize: "0.95rem",
        letterSpacing: "0.01em",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "saturate(120%) blur(20px)",
            WebkitBackdropFilter: "saturate(120%) blur(20px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: "1px solid",
            borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
            background: isDark ? "rgba(17, 17, 24, 0.8)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: isDark 
                ? "0 20px 40px rgba(0, 0, 0, 0.4)" 
                : "0 20px 40px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { 
            borderRadius: 12,
            fontWeight: 600,
            textTransform: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`,
            boxShadow: `0 4px 15px ${primaryColor}40`,
            "&:hover": {
              background: `linear-gradient(135deg, ${primaryColor}CC, ${primaryColor})`,
              boxShadow: `0 8px 25px ${primaryColor}60`,
            },
          },
          outlined: {
            borderColor: primaryColor,
            color: primaryColor,
            "&:hover": {
              background: `${primaryColor}10`,
              borderColor: primaryColor,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-1px)",
              },
              "&.Mui-focused": {
                transform: "translateY(-1px)",
                boxShadow: `0 8px 25px ${primaryColor}20`,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-1px)",
              },
            },
            "& .MuiTabs-indicator": {
              background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}CC)`,
              height: 3,
              borderRadius: "2px 2px 0 0",
            },
          },
        },
      },
    },
  });
}

export default function ThemeProviderClient({ children }) {
  const [primaryColor, setPrimaryColor] = React.useState("#6C47FF");
  const [mode, setMode] = React.useState("light");

  React.useEffect(() => {
    const savedColor = typeof window !== "undefined" && localStorage.getItem("mf-primary");
    const savedMode = typeof window !== "undefined" && localStorage.getItem("mf-mode");
    if (savedColor) setPrimaryColor(savedColor);
    if (savedMode === "light" || savedMode === "dark") setMode(savedMode);
  }, []);

  const handleSetPrimary = React.useCallback((color) => {
    setPrimaryColor(color);
    if (typeof window !== "undefined") localStorage.setItem("mf-primary", color);
  }, []);

  const toggleMode = React.useCallback(() => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      if (typeof window !== "undefined") localStorage.setItem("mf-mode", next);
      return next;
    });
  }, []);

  const theme = React.useMemo(() => buildTheme(primaryColor, mode), [primaryColor, mode]);

  return (
    <ThemeControllerContext.Provider value={{ primaryColor, setPrimaryColor: handleSetPrimary, mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeControllerContext.Provider>
  );
}


