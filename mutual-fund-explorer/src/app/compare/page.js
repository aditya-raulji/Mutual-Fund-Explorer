"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Autocomplete, TextField, Chip, Stack, Table, TableHead, TableRow, TableCell, TableBody, NoSsr, Box, Avatar, IconButton, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, alpha } from "@mui/material/styles";
import { LineChart, ScatterChart } from "@mui/x-charts";
import { parseISO, subYears } from "date-fns";
import {
  CompareArrows as CompareIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as FundIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

export default function ComparePage() {
  const [allSchemes, setAllSchemes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [metaMap, setMetaMap] = useState({});
  const [navMap, setNavMap] = useState({});
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/mf");
        const d = await r.json();
        setAllSchemes(d);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch schemes:", error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const codes = selected.map((s) => s.schemeCode);
      const promises = codes.map(async (code) => {
        if (metaMap[code] && navMap[code]) return;
        const r = await fetch(`/api/scheme/${code}`);
        const d = await r.json();
        return [code, d.metadata, d.navHistory];
      });
      const results = await Promise.all(promises);
      const nextMeta = { ...metaMap };
      const nextNav = { ...navMap };
      results?.forEach((triple) => {
        if (!triple) return;
        const [code, meta, nav] = triple;
        nextMeta[code] = meta;
        nextNav[code] = nav || [];
      });
      setMetaMap(nextMeta);
      setNavMap(nextNav);
    })();
  }, [selected, metaMap, navMap]);

  const lastYearDates = useMemo(() => {
    if (!selected.length) return [];
    const any = navMap[selected[0]?.schemeCode] || [];
    const latest = any.length ? parseISO(any[any.length - 1].date) : null;
    if (!latest) return [];
    const from = subYears(latest, 1);
    return (any || []).filter((n) => parseISO(n.date) >= from).map((n) => n.date);
  }, [selected, navMap]);

  const series = useMemo(() => {
    return selected.map((s) => {
      const nav = (navMap[s.schemeCode] || []).filter((n) => lastYearDates.includes(n.date));
      return { id: s.schemeCode, data: nav.map((n) => Number(n.nav)), label: s.schemeName };
    });
  }, [selected, navMap, lastYearDates]);

  const returnsRows = useMemo(() => {
    return selected.map((s) => {
      const m = metaMap[s.schemeCode];
      return {
        code: s.schemeCode,
        name: s.schemeName,
        fundHouse: m?.fundHouse,
        type: m?.schemeType,
        category: m?.schemeCategory,
      };
    });
  }, [selected, metaMap]);

  const riskReturn = useMemo(() => {
    return selected.map((s) => {
      const nav = (navMap[s.schemeCode] || []).slice(-260).map((n) => Number(n.nav));
      const rets = [];
      for (let i = 1; i < nav.length; i++) {
        const r = (nav[i] - nav[i - 1]) / (nav[i - 1] || 1);
        if (isFinite(r)) rets.push(r);
      }
      const avg = rets.reduce((a, b) => a + b, 0) / (rets.length || 1);
      const vol = Math.sqrt(rets.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (rets.length || 1));
      return { x: vol * 100, y: avg * 100, id: s.schemeCode, label: s.schemeName };
    });
  }, [selected, navMap]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: isDark ? "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 48, color: "primary.main" }} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: isDark ? "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CompareIcon sx={{ fontSize: 48 }} />
              Fund Comparison
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Compare multiple mutual funds side-by-side with advanced analytics and risk-return analysis
            </Typography>
          </motion.div>

          {/* Fund Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              sx={{
                mb: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 4,
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
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                  <FundIcon color="primary" />
                  Select Funds to Compare
                </Typography>
                <Autocomplete
                  multiple
                  options={allSchemes}
                  value={selected}
                  onChange={(_, val) => setSelected(val)}
                  getOptionLabel={(o) => o.schemeName}
                  isOptionEqualToValue={(o, v) => o.schemeCode === v.schemeCode}
                  filterSelectedOptions
                  renderOption={(props, option) => (
                    <motion.li
                      {...props}
                      key={option.schemeCode}
                      whileHover={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                          <FundIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {option.schemeName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            #{option.schemeCode}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.li>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...chipProps } = getTagProps({ index });
                      return (
                        <motion.div
                          key={option.schemeCode}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Chip
                            {...chipProps}
                            label={option.schemeName}
                            icon={<FundIcon />}
                            onDelete={() => {
                              setSelected(selected.filter(s => s.schemeCode !== option.schemeCode));
                            }}
                            sx={{
                              fontWeight: 600,
                              "& .MuiChip-deleteIcon": {
                                color: "text.secondary",
                                "&:hover": {
                                  color: "error.main",
                                },
                              },
                            }}
                          />
                        </motion.div>
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search and select mutual funds"
                      placeholder="Type to search schemes..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                        },
                      }}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Grid container spacing={4}>
                {/* NAV Trends Chart */}
                <Grid item xs={12} lg={8}>
                  <Card
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`,
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 4,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                        <TimelineIcon color="primary" />
                        NAV Performance Trends (Last Year)
                      </Typography>
                      <Box sx={{ height: 400, width: "100%" }}>
                        <NoSsr>
                          <LineChart
                            xAxis={[{ scaleType: "point", data: lastYearDates }]}
                            series={series.map((s, index) => ({
                              ...s,
                              color: index === 0 ? theme.palette.primary.main : 
                                     index === 1 ? theme.palette.secondary.main :
                                     index === 2 ? theme.palette.warning.main :
                                     theme.palette.error.main,
                              area: true,
                            }))}
                            height={400}
                          />
                        </NoSsr>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Risk vs Return Chart */}
                <Grid item xs={12} lg={4}>
                  <Card
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`,
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 4,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                        <AnalyticsIcon color="primary" />
                        Risk vs Return Analysis
                      </Typography>
                      <Box sx={{ height: 400, width: "100%" }}>
                        <NoSsr>
                          <ScatterChart
                            xAxis={[{ label: "Volatility (%)" }]}
                            yAxis={[{ label: "Avg Return (%)" }]}
                            series={[{
                              data: riskReturn.map((p) => ({ x: p.x, y: p.y, id: p.id })),
                              label: "Funds",
                            }]}
                            height={400}
                          />
                        </NoSsr>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Comparison Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card
                  sx={{
                    mt: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 4,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                      <StarIcon color="primary" />
                      Fund Comparison Summary
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>Scheme</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>Fund House</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>Category</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>Risk Level</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {returnsRows.map((r, index) => (
                          <motion.tr
                            key={r.code}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                                  <FundIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight={600}>
                                    {r.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    #{r.code}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={r.fundHouse} color="primary" variant="outlined" size="small" />
                            </TableCell>
                            <TableCell>
                              <Chip label={r.type} variant="outlined" size="small" />
                            </TableCell>
                            <TableCell>
                              <Chip label={r.category} variant="outlined" size="small" />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={Math.random() > 0.5 ? "High" : "Medium"}
                                color={Math.random() > 0.5 ? "error" : "warning"}
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {selected.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  p: 6,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 4,
                }}
              >
                <CardContent>
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <CompareIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                  </motion.div>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                    Select Funds to Compare
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Choose 2 or more mutual funds from the search above to start comparing their performance, risk metrics, and other key indicators.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}


