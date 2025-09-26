"use client";

import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import NavColorControl from "./NavColorControl";
import { alpha } from "@mui/material/styles";
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  CompareArrows as CompareIcon,
  AccountBalance as FundIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon
} from "@mui/icons-material";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const defaultSchemeCode = "118834";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "Funds", href: "/funds", icon: <FundIcon /> },
    { label: "Compare", href: "/compare", icon: <CompareIcon /> },
    { label: "Analytics", href: `/scheme/${defaultSchemeCode}`, icon: <AnalyticsIcon /> },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={(theme) => ({
          background: scrolled 
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)} 0%, ${alpha(theme.palette.primary.dark || theme.palette.primary.main, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark || theme.palette.primary.main, 0.9)} 100%)`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: scrolled 
            ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
            : "none",
        })}
      >
        <Toolbar sx={{ gap: 2, py: 1 }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <TrendingUpIcon sx={{ color: "white", fontSize: 28 }} />
              </motion.div>
              <Typography 
                variant="h6" 
                sx={{ 
                  flexGrow: 1, 
                  letterSpacing: 0.5,
                  fontWeight: 800,
                  background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Mutual Fund Explorer
              </Typography>
            </Box>
          </motion.div>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, ml: 4 }}>
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isActive(item.href) 
                        ? alpha("#ffffff", 0.2)
                        : "transparent",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                    },
                    "&:hover::before": {
                      background: alpha("#ffffff", 0.15),
                    },
                    "&:hover": {
                      background: alpha("#ffffff", 0.1),
                    },
                  }}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        width: "80%",
                        height: 3,
                        background: "linear-gradient(90deg, #ffffff, #f0f0f0)",
                        borderRadius: "2px 2px 0 0",
                        transform: "translateX(-50%)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Theme Controls */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <NavColorControl />
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CloseIcon />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </IconButton>
        </Toolbar>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <Box sx={{ 
                px: 2, 
                pb: 2, 
                background: alpha("#000000", 0.1),
                backdropFilter: "blur(10px)",
              }}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      component={Link}
                      href={item.href}
                      startIcon={item.icon}
                      fullWidth
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        py: 1.5,
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        mb: 0.5,
                        background: isActive(item.href) 
                          ? alpha("#ffffff", 0.2)
                          : "transparent",
                        "&:hover": {
                          background: alpha("#ffffff", 0.15),
                        },
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
                <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha("#ffffff", 0.2)}` }}>
                  <NavColorControl />
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </AppBar>
    </motion.div>
  );
}
