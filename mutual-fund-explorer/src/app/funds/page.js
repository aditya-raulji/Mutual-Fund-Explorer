"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Pagination,
  Stack,
  InputAdornment,
  Chip,
  Box,
  Button,
  CardActionArea,
  Menu,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Container,
} from "@mui/material";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, alpha } from "@mui/material/styles";
import BrandedLoader from "@/components/BrandedLoader";
import { ThemeControllerContext } from "@/components/ThemeProviderClient";
import {
  SearchRounded as SearchIcon,
  AutoAwesomeRounded as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as FundIcon,
  CompareArrows as CompareIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Star as StarFilledIcon,
  StarBorder as StarOutlineIcon,
  Whatshot as HotIcon,
  NewReleases as NewIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";

const PAGE_SIZE = 30;

export default function FundsPage() {
  const theme = useTheme();
  const { primaryColor, setPrimaryColor, mode } = React.useContext(ThemeControllerContext);
  const [colorAnchor, setColorAnchor] = useState(null);
  const colorOpen = Boolean(colorAnchor);
  const handleOpenColor = (e) => setColorAnchor(e.currentTarget);
  const handleCloseColor = () => setColorAnchor(null);
  const [schemes, setSchemes] = useState([]);
  const [metadataMap, setMetadataMap] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState(new Set());
  const isDark = mode === "dark";

  // Fetch the list of schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch("/api/mf");
        const data = await res.json();
        setSchemes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchemes();
  }, []);

  // Fetch metadata for schemes on the current page
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const currentSchemes = schemes.slice(start, end);

      const promises = currentSchemes.map(async (scheme) => {
        if (!metadataMap[scheme.schemeCode]) {
          try {
            const res = await fetch(`/api/scheme/${scheme.schemeCode}`);
            const data = await res.json();
            return [scheme.schemeCode, data.metadata];
          } catch (err) {
            return [scheme.schemeCode, null];
          }
        } else {
          return [scheme.schemeCode, metadataMap[scheme.schemeCode]];
        }
      });

      const results = await Promise.all(promises);
      const newMap = { ...metadataMap };
      results.forEach(([code, meta]) => {
        newMap[code] = meta;
      });
      setMetadataMap(newMap);
      setLoading(false);
    };

    if (schemes.length > 0) fetchMetadata();
  }, [schemes, page, metadataMap]);

  // Filter and sort schemes
  const filteredSchemes = useMemo(() => {
    let filtered = schemes.filter((scheme) =>
      scheme.schemeName.toLowerCase().includes(search.toLowerCase())
    );

    // Sort schemes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.schemeName.localeCompare(b.schemeName);
        case "code":
          return a.schemeCode.localeCompare(b.schemeCode);
        case "favorites":
          const aFav = favorites.has(a.schemeCode);
          const bFav = favorites.has(b.schemeCode);
          return bFav - aFav;
        default:
          return 0;
      }
    });

    return filtered;
  }, [schemes, search, sortBy, favorites]);

  const paginatedSchemes = filteredSchemes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleFavorite = (schemeCode) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(schemeCode)) {
        newFavorites.delete(schemeCode);
      } else {
        newFavorites.add(schemeCode);
      }
      return newFavorites;
    });
  };

  const getFundBadge = (scheme, meta) => {
    // Mock some performance indicators for demo
    const random = Math.random();
    if (random > 0.9) return { icon: <TrophyIcon />, label: "Top Performer", color: "warning" };
    if (random > 0.8) return { icon: <HotIcon />, label: "Trending", color: "error" };
    if (random > 0.7) return { icon: <NewIcon />, label: "New", color: "info" };
    return null;
  };

  if (loading) return <BrandedLoader label="Fetching funds and metadata..." />;

  return (
    <Box sx={{ minHeight: "100vh", background: isDark ? "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <Box sx={{ mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Typography
                variant="h2"
                sx={{
                  mb: 2,
                  background: `linear-gradient(135deg, ${primaryColor}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 900,
                }}
              >
                Explore Mutual Funds
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Discover and analyze 5,000+ mutual fund schemes with advanced filtering and comparison tools
              </Typography>
            </motion.div>

            {/* Search and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Stack spacing={3} direction={{ xs: "column", md: "row" }} alignItems="center">
                  <TextField
                    label="Search schemes"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />
                  
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Sort by name">
                      <IconButton
                        onClick={() => setSortBy("name")}
                        color={sortBy === "name" ? "primary" : "default"}
                      >
                        <SortIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Show favorites first">
                      <IconButton
                        onClick={() => setSortBy("favorites")}
                        color={sortBy === "favorites" ? "primary" : "default"}
                      >
                        <StarFilledIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Theme color">
                      <Button
                        variant="outlined"
                        onClick={handleOpenColor}
                        startIcon={<StarIcon />}
                        sx={{ borderRadius: 3 }}
                      >
                        Theme
                        <Box
                          sx={{
                            ml: 1,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            bgcolor: primaryColor,
                            border: "1px solid",
                            borderColor: theme.palette.divider,
                          }}
                        />
                      </Button>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Card>
            </motion.div>
          </Box>

          {/* Funds Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedSchemes.map((scheme, index) => {
                  const meta = metadataMap[scheme.schemeCode];
                  const isFavorite = favorites.has(scheme.schemeCode);
                  const badge = getFundBadge(scheme, meta);

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={scheme.schemeCode}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`,
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid",
                            borderColor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: 4,
                            position: "relative",
                            overflow: "hidden",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              boxShadow: `0 20px 40px ${alpha(primaryColor, 0.15)}`,
                              borderColor: alpha(primaryColor, 0.3),
                            },
                          }}
                        >
                          {/* Top Gradient Bar */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: `linear-gradient(90deg, ${primaryColor}, ${theme.palette.secondary.main})`,
                            }}
                          />

                          {/* Badge */}
                          {badge && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 1,
                              }}
                            >
                              <Chip
                                icon={badge.icon}
                                label={badge.label}
                                size="small"
                                color={badge.color}
                                sx={{
                                  fontWeight: 600,
                                  boxShadow: `0 4px 12px ${alpha(theme.palette[badge.color].main, 0.3)}`,
                                }}
                              />
                            </Box>
                          )}

                          <CardActionArea
                            component={Link}
                            href={`/scheme/${scheme.schemeCode}`}
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              p: 0,
                            }}
                          >
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              <Stack spacing={2}>
                                {/* Header */}
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                  <Avatar
                                    sx={{
                                      bgcolor: `linear-gradient(135deg, ${primaryColor}, ${theme.palette.secondary.main})`,
                                      width: 48,
                                      height: 48,
                                      flexShrink: 0,
                                    }}
                                  >
                                    <FundIcon />
                                  </Avatar>
                                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography
                                      variant="h6"
                                      fontWeight={700}
                                      sx={{
                                        mb: 0.5,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {scheme.schemeName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      #{scheme.schemeCode}
                                    </Typography>
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleFavorite(scheme.schemeCode);
                                    }}
                                    sx={{
                                      color: isFavorite ? theme.palette.warning.main : "text.secondary",
                                      "&:hover": {
                                        color: theme.palette.warning.main,
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    {isFavorite ? <StarFilledIcon /> : <StarOutlineIcon />}
                                  </IconButton>
                                </Stack>

                                {/* Metadata Chips */}
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                                  <Chip
                                    size="small"
                                    label={meta?.fundHouse || "Unknown"}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                  />
                                  <Chip
                                    size="small"
                                    label={meta?.schemeType || "N/A"}
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                  />
                                  <Chip
                                    size="small"
                                    label={meta?.schemeCategory || "N/A"}
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                  />
                                </Stack>

                                {/* Mock Performance Indicator */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    background: alpha(theme.palette.primary.main, 0.05),
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                  }}
                                >
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Last 1Y Return
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} color="success.main">
                                      +{Math.random() * 20 + 5}%
                                    </Typography>
                                  </Box>
                                  <TrendingUpIcon color="success" />
                                </Box>
                              </Stack>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </AnimatePresence>
            </Grid>
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
              <Pagination
                color="primary"
                count={Math.ceil(filteredSchemes.length / PAGE_SIZE)}
                page={page}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Theme Color Menu */}
      <Menu anchorEl={colorAnchor} open={colorOpen} onClose={handleCloseColor} keepMounted>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Choose Theme Color
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {["#6C47FF", "#667eea", "#f093fb", "#4facfe", "#43e97b", "#f5576c"].map((color) => (
              <Box
                key={color}
                onClick={() => setPrimaryColor(color)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: color,
                  cursor: "pointer",
                  border: primaryColor === color ? "3px solid" : "1px solid",
                  borderColor: primaryColor === color ? "primary.main" : "divider",
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />
            ))}
          </Box>
          <TextField
            size="small"
            label="Custom Color"
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Box>
      </Menu>
    </Box>
  );
}
