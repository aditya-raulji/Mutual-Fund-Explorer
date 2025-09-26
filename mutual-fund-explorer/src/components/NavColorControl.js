"use client";

import React from "react";
import { Box, IconButton, Tooltip, useTheme, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Divider, alpha } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { ThemeControllerContext } from "./ThemeProviderClient";

const swatches = [
  { color: "#6C47FF", name: "Purple" },
  { color: "#667eea", name: "Blue" },
  { color: "#f093fb", name: "Pink" },
  { color: "#4facfe", name: "Cyan" },
  { color: "#43e97b", name: "Green" },
  { color: "#f5576c", name: "Red" },
  { color: "#00BFA6", name: "Teal" },
  { color: "#E91E63", name: "Magenta" },
  { color: "#FF8A00", name: "Orange" },
  { color: "#2D7DFF", name: "Indigo" },
  { color: "#8E24AA", name: "Deep Purple" },
  { color: "#795548", name: "Brown" },
]; 

export default function NavColorControl() {
  const { primaryColor, setPrimaryColor, mode, toggleMode } = React.useContext(ThemeControllerContext);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Customize Theme">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton 
            color="inherit" 
            onClick={handleOpen} 
            aria-label="choose theme"
            sx={{
              background: alpha(theme.palette.background.paper, 0.1),
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.2),
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.1),
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            }}
          >
            <ColorLensRoundedIcon />
          </IconButton>
        </motion.div>
      </Tooltip>
      
      <Tooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton 
            color="inherit" 
            onClick={toggleMode} 
            aria-label="toggle mode"
            sx={{
              background: alpha(theme.palette.background.paper, 0.1),
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.2),
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.1),
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </motion.div>
            </AnimatePresence>
          </IconButton>
        </motion.div>
      </Tooltip>
      
      <Menu 
        anchorEl={anchorEl} 
        open={open} 
        onClose={handleClose} 
        keepMounted
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.default, 0.95)})`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 3,
            mt: 1,
            minWidth: 280,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeRoundedIcon color="primary" />
            Theme Customization
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose your preferred color scheme
          </Typography>
          
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, mb: 3 }}>
            {swatches.map((swatch) => (
              <motion.div
                key={swatch.color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Box
                  onClick={() => { setPrimaryColor(swatch.color); handleClose(); }}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: swatch.color,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: primaryColor === swatch.color ? "3px solid" : "1px solid",
                    borderColor: primaryColor === swatch.color ? theme.palette.primary.main : alpha(theme.palette.divider, 0.3),
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${alpha(swatch.color, 0.4)}`,
                    },
                  }}
                >
                  {primaryColor === swatch.color && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Current Theme: {mode === "dark" ? "Dark" : "Light"} Mode
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Primary Color: {primaryColor}
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
}


