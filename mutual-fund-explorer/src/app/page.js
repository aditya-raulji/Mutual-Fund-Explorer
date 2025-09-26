"use client";

import { Container, Box, Typography, Button, Grid, Card, CardContent, Stack, TextField, Chip, Avatar, IconButton } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ThemeControllerContext } from "@/components/ThemeProviderClient";
import { 
  TrendingUp, 
  Search, 
  Analytics, 
  Calculate, 
  CompareArrows, 
  AccountBalance,
  Star,
  TrendingDown,
  AutoAwesome,
  Rocket,
  Security,
  Speed
} from "@mui/icons-material";

export default function Home() {
  const theme = useTheme();
  const { primaryColor, setPrimaryColor, mode } = React.useContext(ThemeControllerContext);
  const isDark = mode === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const stats = [
    { label: "5,000+", sublabel: "Schemes", icon: <AccountBalance />, color: "primary" },
    { label: "15.2%", sublabel: "Avg Returns", icon: <TrendingUp />, color: "success" },
    { label: "₹2.5L Cr", sublabel: "AUM", icon: <Analytics />, color: "warning" },
    { label: "99.9%", sublabel: "Uptime", icon: <Security />, color: "error" },
  ];

  const features = [
    {
      icon: <Search />,
      title: "Smart Search & Filter",
      description: "Advanced search with real-time filtering across 5,000+ mutual fund schemes",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: <Analytics />,
      title: "Advanced Analytics",
      description: "Comprehensive NAV analysis, returns calculation, and performance metrics",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: <Calculate />,
      title: "Investment Calculators",
      description: "SIP, Lumpsum, and SWP calculators with detailed projections and comparisons",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: <CompareArrows />,
      title: "Fund Comparison",
      description: "Side-by-side comparison of multiple funds with risk-return analysis",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Animated Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e0 100%)",
          zIndex: -2,
        }}
      />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `linear-gradient(45deg, ${primaryColor}, ${primaryColor}80)`,
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: -1,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                textAlign: "center",
                mb: 8,
                position: "relative",
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                borderRadius: 6,
                p: { xs: 4, md: 8 },
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.2),
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                overflow: "hidden",
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 20% 80%, ${alpha(primaryColor, 0.1)} 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
                  zIndex: -1,
                }}
              />

              <motion.div variants={floatingVariants} animate="animate">
                <Typography
                  variant="h1"
                  sx={{
                    mb: 3,
                    background: `linear-gradient(135deg, ${primaryColor}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Discover Mutual Funds with Confidence
                </Typography>
              </motion.div>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  maxWidth: 800,
                  mx: "auto",
                  mb: 4,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Advanced mutual fund analysis platform with real-time data, comprehensive analytics,
                and intelligent investment calculators to help you make informed decisions.
              </Typography>

              <Stack
                spacing={3}
                direction={{ xs: "column", sm: "row" }}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    href="/funds"
                    startIcon={<Rocket />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: "none",
                    }}
                  >
                    Start Exploring
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href="/compare"
                    startIcon={<CompareArrows />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: "none",
                    }}
                  >
                    Compare Funds
                  </Button>
                </motion.div>
              </Stack>

              {/* Theme Color Picker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 2,
                    background: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <AutoAwesome sx={{ color: primaryColor }} />
                  <Typography variant="body2" color="text.secondary">
                    Customize theme:
                  </Typography>
                  <TextField
                    size="small"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    sx={{
                      width: 60,
                      height: 40,
                      "& .MuiOutlinedInput-root": {
                        height: 40,
                        padding: 0,
                      },
                      "& input": {
                        padding: 0,
                        cursor: "pointer",
                      },
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 8 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      sx={{
                        textAlign: "center",
                        p: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette[stat.color].main, 0.1)}, ${alpha(theme.palette[stat.color].main, 0.05)})`,
                        border: `1px solid ${alpha(theme.palette[stat.color].main, 0.2)}`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 100,
                          height: 100,
                          background: `radial-gradient(circle, ${alpha(theme.palette[stat.color].main, 0.1)} 0%, transparent 70%)`,
                          borderRadius: "50%",
                          transform: "translate(30px, -30px)",
                        }}
                      />
                      <Avatar
                        sx={{
                          bgcolor: theme.palette[stat.color].main,
                          width: 56,
                          height: 56,
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Typography variant="h4" fontWeight={800} color={theme.palette[stat.color].main}>
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.sublabel}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Features Section */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              textAlign="center"
              sx={{
                mb: 6,
                background: `linear-gradient(135deg, ${primaryColor}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 800,
              }}
            >
              Powerful Features
            </Typography>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        p: 4,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                        border: "1px solid",
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: feature.gradient,
                        }}
                      />
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                        <Avatar
                          sx={{
                            background: feature.gradient,
                            width: 56,
                            height: 56,
                            flexShrink: 0,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                textAlign: "center",
                mt: 8,
                p: 6,
                background: `linear-gradient(135deg, ${alpha(primaryColor, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                borderRadius: 4,
                border: "1px solid",
                borderColor: alpha(primaryColor, 0.2),
              }}
            >
              <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
                Ready to Start Your Investment Journey?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
                Join thousands of investors who trust our platform for their mutual fund research and analysis.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    href="/funds"
                    startIcon={<Search />}
                    sx={{ px: 4, py: 1.5, fontSize: "1.1rem", fontWeight: 700 }}
                  >
                    Browse Funds
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href="/compare"
                    startIcon={<Analytics />}
                    sx={{ px: 4, py: 1.5, fontSize: "1.1rem", fontWeight: 700 }}
                  >
                    View Analytics
                  </Button>
                </motion.div>
              </Stack>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
