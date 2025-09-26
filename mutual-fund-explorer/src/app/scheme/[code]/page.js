"use client";

import React, { useState, useEffect, use } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  NoSsr,
  Box,
  Chip,
  Stack,
  Tabs,
  Tab,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, alpha } from "@mui/material/styles";
import BrandedLoader from "@/components/BrandedLoader";
import { ThemeControllerContext } from "@/components/ThemeProviderClient";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as FundIcon,
  Calculate as CalculateIcon,
  CompareArrows as CompareIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  EmojiEvents as TrophyIcon,
  AccountBalance,
  CompareArrows,
} from "@mui/icons-material";

import { LineChart } from "@mui/x-charts/LineChart";
import { parseISO, addMonths, addWeeks, addYears, differenceInYears, subYears } from "date-fns";

export default function SchemeDetailPage({ params }) {
  const { code } = use(params);
  const theme = useTheme();
  const { primaryColor, setPrimaryColor, mode } = React.useContext(ThemeControllerContext);
  const [metadata, setMetadata] = useState(null);
  const [navHistory, setNavHistory] = useState([]);
  const [returnsRows, setReturnsRows] = useState([]);
  const [tab, setTab] = useState(0);
  const [sipAmount, setSipAmount] = useState(5000);
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [sipResult, setSipResult] = useState(null);
  const [lumpsumAmount, setLumpsumAmount] = useState(50000);
  const [swpAmount, setSwpAmount] = useState(2000);
  const [swpFrequency, setSwpFrequency] = useState("monthly");
  const [showMA, setShowMA] = useState(false);
  const [maWindow, setMaWindow] = useState(10);
  const [isCalculating, setIsCalculating] = useState(false);
  const isDark = mode === "dark";

  useEffect(() => {
    let cancelled = false;
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/scheme/${code}`);
        if (!res.ok) throw new Error("Failed to fetch scheme details");
        const data = await res.json();
        if (!cancelled) {
          setMetadata(data.metadata);
          setNavHistory(Array.isArray(data.navHistory) ? data.navHistory : []);
        }
      } catch (e) {
        console.error("/scheme/[code]: failed to load details", e);
      }
    }
    fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    let cancelled = false;
    async function fetchReturns() {
      try {
        const periods = ["1m", "3m", "6m", "1y"];
        const results = await Promise.all(
          periods.map(async (p) => {
            const r = await fetch(`/api/scheme/${code}/returns?period=${p}`);
            if (!r.ok) return { period: p, needs_review: true };
            const d = await r.json();
            return {
              period: p,
              startDate: d.startDate,
              endDate: d.endDate,
              startNav: d.startNAV,
              endNav: d.endNAV,
              simpleReturn: d.simpleReturn,
              annualizedReturn: d.annualizedReturn,
            };
          })
        );
        if (!cancelled) setReturnsRows(results);
      } catch (e) {
        console.warn("/scheme/[code]: returns fetch failed", e);
        if (!cancelled) setReturnsRows([]);
      }
    }
    if (code) fetchReturns();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const handleCalculateSIP = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!Array.isArray(navHistory) || navHistory.length === 0) {
      setSipResult({ needsReview: true, reason: "No NAV history available" });
      setIsCalculating(false);
      return;
    }

    const from = parseISO(startDate);
    const to = parseISO(endDate);
    if (isNaN(from) || isNaN(to) || from > to) {
      setSipResult({ needsReview: true, reason: "Invalid date range" });
      setIsCalculating(false);
      return;
    }

    const dates = [];
    let current = from;
    while (current <= to) {
      dates.push(new Date(current));
      if (frequency === "monthly") current = addMonths(current, 1);
      else if (frequency === "weekly") current = addWeeks(current, 1);
      else if (frequency === "yearly") current = addYears(current, 1);
      else break;
    }

    const sortedNav = [...navHistory]
      .filter((n) => n && n.nav != null)
      .sort((a, b) => parseISO(a.date) - parseISO(b.date));

    let totalUnits = 0;
    let totalInvested = 0;
    const labels = [];
    const values = [];

    dates.forEach((d) => {
      const navEntry = [...sortedNav]
        .filter((n) => parseISO(n.date) <= d && Number(n.nav) > 0)
        .pop();
      if (!navEntry) return; // skip if no NAV before/on this date
      const units = sipAmount / Number(navEntry.nav);
      if (!isFinite(units)) return;
      totalUnits += units;
      totalInvested += sipAmount;
      labels.push(d.toISOString().split("T")[0]);
      values.push(parseFloat((totalUnits * Number(navEntry.nav)).toFixed(2)));
    });

    const latestNavEntry = [...sortedNav].filter((n) => Number(n.nav) > 0).pop();
    if (!latestNavEntry || totalInvested <= 0) {
      setSipResult({ needsReview: true, reason: "Insufficient data for calculation" });
      setIsCalculating(false);
      return;
    }

    const finalCurrentValue = totalUnits * Number(latestNavEntry.nav);
    const absoluteReturn = ((finalCurrentValue - totalInvested) / totalInvested) * 100;
    const years = Math.max(differenceInYears(to, from), 0.0001);
    const annualizedReturn = (Math.pow(finalCurrentValue / totalInvested, 1 / years) - 1) * 100;

    setSipResult({
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      currentValue: parseFloat(finalCurrentValue.toFixed(2)),
      absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
      annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
      chart: { labels, values },
    });
    
    setIsCalculating(false);
  };

  if (!metadata) return <BrandedLoader label="Loading scheme details..." />;

  // NAV last 1 year based on latest available NAV date (deterministic for SSR/CSR)
  const latestDate = navHistory.length ? parseISO(navHistory[navHistory.length - 1].date) : null;
  const oneYearAgo = latestDate ? subYears(latestDate, 1) : null;
  const points = oneYearAgo ? navHistory.filter((n) => parseISO(n.date) >= oneYearAgo) : [];
  const x = points.map((p) => p.date);
  const y = points.map((p) => Number(p.nav));

  const tabIcons = [
    <TimelineIcon key="timeline" />,
    <AnalyticsIcon key="analytics" />,
    <CalculateIcon key="calculate" />,
    <AccountBalance key="account" />,
    <CompareArrows key="compare" />,
    <CompareIcon key="compare2" />
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: isDark ? "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                position: "relative",
              }}
            >
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
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        background: `linear-gradient(135deg, ${primaryColor}, ${theme.palette.secondary.main})`,
                        flexShrink: 0,
                      }}
                    >
                      <FundIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h3" fontWeight={900} sx={{ mb: 1 }}>
                        {metadata.schemeName}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        {metadata.fundHouse} • #{code}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        <Chip
                          icon={<StarIcon />}
                          label={metadata.schemeCategory}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip
                          label={metadata.schemeType}
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                        {metadata.isinGrowth && (
                          <Chip
                            label={`ISIN G: ${metadata.isinGrowth}`}
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                        {metadata.isinDividend && (
                          <Chip
                            label={`ISIN D: ${metadata.isinDividend}`}
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Paper
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
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    minHeight: 64,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                  },
                }}
              >
                {["Overview", "Returns", "SIP Calculator", "Lumpsum", "SWP", "Strategies Compare"].map((label, index) => (
                  <Tab
                    key={label}
                    label={label}
                    icon={tabIcons[index]}
                    iconPosition="start"
                    sx={{
                      "&.Mui-selected": {
                        color: primaryColor,
                      },
                    }}
                  />
                ))}
              </Tabs>
              <Box sx={{ p: 3 }}>
                <AnimatePresence mode="wait">
                  {tab === 0 && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 2 }}>
                              <Typography variant="h5" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <TimelineIcon color="primary" />
                                NAV Performance (Last 1 Year)
                              </Typography>
                              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                                <Chip
                                  icon={<AutoAwesomeIcon />}
                                  label={showMA ? "MA: ON" : "MA: OFF"}
                                  onClick={() => setShowMA((v) => !v)}
                                  variant="outlined"
                                  color={showMA ? "primary" : "default"}
                                  sx={{ fontWeight: 600 }}
                                />
                                <TextField
                                  size="small"
                                  label="MA Window"
                                  type="number"
                                  value={maWindow}
                                  onChange={(e) => setMaWindow(Math.max(2, Number(e.target.value) || 10))}
                                  sx={{ width: 120 }}
                                />
                              </Stack>
                            </Stack>
                            <Box sx={{ height: 400, width: "100%" }}>
                              <NoSsr>
                                <LineChart
                                  xAxis={[{ scaleType: "point", data: x }]}
                                  series={[
                                    {
                                      data: y,
                                      label: "NAV",
                                      area: true,
                                      color: primaryColor,
                                    },
                                    ...(showMA ? [{
                                      data: movingAverage(y, maWindow),
                                      label: `MA(${maWindow})`,
                                      color: theme.palette.secondary?.main || theme.palette.text.secondary,
                                      curve: "monotoneX"
                                    }] : []),
                                  ]}
                                  height={400}
                                  sx={{
                                    "& .MuiChartsAxis-root": {
                                      "& .MuiChartsAxis-tickLabel": {
                                        fill: theme.palette.text.secondary,
                                      },
                                    },
                                  }}
                                />
                              </NoSsr>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
          {tab === 1 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Pre-computed Returns</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Start NAV</TableCell>
                      <TableCell>End NAV</TableCell>
                      <TableCell>Simple Return (%)</TableCell>
                      <TableCell>Annualized Return (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {returnsRows.map((r, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{r.period}</TableCell>
                        <TableCell>{r.startDate || "-"}</TableCell>
                        <TableCell>{r.endDate || "-"}</TableCell>
                        <TableCell>{r.startNav ?? "-"}</TableCell>
                        <TableCell>{r.endNav ?? "-"}</TableCell>
                        <TableCell>{r.simpleReturn ?? "-"}</TableCell>
                        <TableCell>{r.annualizedReturn ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
                  {tab === 2 && (
                    <motion.div
                      key="sip"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Stack spacing={4}>
                            <Typography variant="h5" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalculateIcon color="primary" />
                              SIP Calculator
                            </Typography>
                            
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="SIP Amount"
                                  type="number"
                                  fullWidth
                                  value={sipAmount}
                                  onChange={(e) => setSipAmount(Number(e.target.value))}
                                  InputProps={{
                                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                  }}
                                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="Frequency"
                                  select
                                  fullWidth
                                  value={frequency}
                                  onChange={(e) => setFrequency(e.target.value)}
                                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                >
                                  <MenuItem value="weekly">Weekly</MenuItem>
                                  <MenuItem value="monthly">Monthly</MenuItem>
                                  <MenuItem value="yearly">Yearly</MenuItem>
                                </TextField>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="Start Date"
                                  type="date"
                                  fullWidth
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  label="End Date"
                                  type="date"
                                  fullWidth
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                />
                              </Grid>
                            </Grid>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="contained"
                                size="large"
                                onClick={handleCalculateSIP}
                                disabled={isCalculating}
                                startIcon={isCalculating ? <LinearProgress size={20} /> : <CalculateIcon />}
                                sx={{
                                  px: 4,
                                  py: 1.5,
                                  fontSize: "1.1rem",
                                  fontWeight: 700,
                                  borderRadius: 3,
                                  background: `linear-gradient(135deg, ${primaryColor}, ${theme.palette.secondary.main})`,
                                  "&:hover": {
                                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${primaryColor})`,
                                  },
                                }}
                              >
                                {isCalculating ? "Calculating..." : "Calculate Returns"}
                              </Button>
                            </motion.div>

                            {sipResult && !sipResult.needsReview && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Card
                                  sx={{
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                    borderRadius: 3,
                                  }}
                                >
                                  <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                      <TrophyIcon color="success" />
                                      Investment Results
                                    </Typography>
                                    
                                    <Grid container spacing={3} sx={{ mb: 4 }}>
                                      <Grid item xs={6} md={3}>
                                        <Box sx={{ textAlign: "center", p: 2 }}>
                                          <Typography variant="h4" fontWeight={800} color="success.main">
                                            ₹{sipResult.totalInvested.toLocaleString()}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            Total Invested
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={6} md={3}>
                                        <Box sx={{ textAlign: "center", p: 2 }}>
                                          <Typography variant="h4" fontWeight={800} color="primary.main">
                                            ₹{sipResult.currentValue.toLocaleString()}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            Current Value
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={6} md={3}>
                                        <Box sx={{ textAlign: "center", p: 2 }}>
                                          <Typography variant="h4" fontWeight={800} color={sipResult.absoluteReturn >= 0 ? "success.main" : "error.main"}>
                                            {sipResult.absoluteReturn >= 0 ? "+" : ""}{sipResult.absoluteReturn}%
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            Absolute Return
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={6} md={3}>
                                        <Box sx={{ textAlign: "center", p: 2 }}>
                                          <Typography variant="h4" fontWeight={800} color={sipResult.annualizedReturn >= 0 ? "success.main" : "error.main"}>
                                            {sipResult.annualizedReturn >= 0 ? "+" : ""}{sipResult.annualizedReturn}%
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            Annualized Return
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>

                                    <Box sx={{ height: 300, width: "100%" }}>
                                      <NoSsr>
                                        <LineChart
                                          xAxis={[{ scaleType: "point", data: sipResult.chart.labels }]}
                                          series={[{
                                            data: sipResult.chart.values,
                                            label: "Investment Value",
                                            color: primaryColor,
                                            area: true,
                                          }]}
                                          height={300}
                                        />
                                      </NoSsr>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )}

                            {sipResult && sipResult.needsReview && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Card
                                  sx={{
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.error.main, 0.05)})`,
                                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                    borderRadius: 3,
                                  }}
                                >
                                  <CardContent sx={{ p: 3 }}>
                                    <Typography color="error" variant="h6" fontWeight={600}>
                                      ⚠️ Calculation Error
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                      {sipResult.reason || "Insufficient data for calculation"}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                  {tab === 3 && (
                    <motion.div
                      key="lumpsum"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                            <AccountBalance color="primary" />
                            Lumpsum Calculator
                          </Typography>
                          <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Lumpsum Amount"
                                type="number"
                                fullWidth
                                value={lumpsumAmount}
                                onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                                InputProps={{
                                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Start Date"
                                type="date"
                                fullWidth
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="End Date"
                                type="date"
                                fullWidth
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              />
                            </Grid>
                          </Grid>
                          <Box sx={{ height: 300, width: "100%" }}>
                            <NoSsr>
                              <LineChart
                                xAxis={[{ scaleType: "point", data: x }]}
                                series={[{
                                  data: simulateLumpsum(navHistory, lumpsumAmount, startDate, endDate),
                                  label: "Lumpsum Value",
                                  area: true,
                                  color: primaryColor,
                                }]}
                                height={300}
                              />
                            </NoSsr>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {tab === 4 && (
                    <motion.div
                      key="swp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                            <CompareArrows color="primary" />
                            SWP Calculator
                          </Typography>
                          <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Withdrawal Amount"
                                type="number"
                                fullWidth
                                value={swpAmount}
                                onChange={(e) => setSwpAmount(Number(e.target.value))}
                                InputProps={{
                                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Frequency"
                                select
                                fullWidth
                                value={swpFrequency}
                                onChange={(e) => setSwpFrequency(e.target.value)}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              >
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                label="Start Date"
                                type="date"
                                fullWidth
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              />
                            </Grid>
                          </Grid>
                          <Box sx={{ height: 300, width: "100%" }}>
                            <NoSsr>
                              <LineChart
                                xAxis={[{ scaleType: "point", data: x }]}
                                series={[{
                                  data: simulateSWP(navHistory, swpAmount, swpFrequency, startDate),
                                  label: "Portfolio Value",
                                  area: true,
                                  color: theme.palette.secondary.main,
                                }]}
                                height={300}
                              />
                            </NoSsr>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {tab === 5 && (
                    <motion.div
                      key="compare"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.8)})`,
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                            <CompareIcon color="primary" />
                            Investment Strategies Comparison
                          </Typography>
                          <Box sx={{ height: 400, width: "100%" }}>
                            <NoSsr>
                              <LineChart
                                xAxis={[{ scaleType: "point", data: x }]}
                                series={[
                                  {
                                    data: simulateSIPSeries(navHistory, sipAmount, frequency, startDate, endDate),
                                    label: "SIP",
                                    color: primaryColor,
                                    area: true,
                                  },
                                  {
                                    data: simulateLumpsum(navHistory, lumpsumAmount, startDate, endDate),
                                    label: "Lumpsum",
                                    color: theme.palette.secondary.main,
                                    area: true,
                                  },
                                  {
                                    data: simulateSWP(navHistory, swpAmount, swpFrequency, startDate),
                                    label: "SWP",
                                    color: theme.palette.warning.main,
                                    area: true,
                                  },
                                ]}
                                height={400}
                              />
                            </NoSsr>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}

// Utilities
function movingAverage(values, windowSize) {
  const out = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const slice = values.slice(start, i + 1).filter((v) => typeof v === "number" && isFinite(v));
    if (slice.length === 0) out.push(null);
    else out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}

function simulateLumpsum(navHistory, amount, startDateStr, endDateStr) {
  if (!Array.isArray(navHistory) || navHistory.length === 0) return [];
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);
  const sorted = [...navHistory].filter((n) => n && n.nav != null).sort((a, b) => parseISO(a.date) - parseISO(b.date));
  const firstEntry = sorted.find((n) => parseISO(n.date) >= start) || sorted[0];
  if (!firstEntry) return [];
  const units = amount / Number(firstEntry.nav);
  const series = sorted.filter((n) => parseISO(n.date) >= start && parseISO(n.date) <= end).map((n) => parseFloat((units * Number(n.nav)).toFixed(2)));
  return series;
}

function simulateSWP(navHistory, withdrawal, frequency, startDateStr) {
  if (!Array.isArray(navHistory) || navHistory.length === 0) return [];
  const start = parseISO(startDateStr);
  const sorted = [...navHistory].filter((n) => n && n.nav != null).sort((a, b) => parseISO(a.date) - parseISO(b.date));
  const startIndex = sorted.findIndex((n) => parseISO(n.date) >= start);
  if (startIndex < 0) return [];
  let units = 0;
  // Start with investing equal to 12x withdrawal as a baseline corpus
  const initialAmount = withdrawal * 12;
  if (sorted[startIndex]) units = initialAmount / Number(sorted[startIndex].nav);
  const series = [];
  let counter = 0;
  const step = (freq) => (freq === "weekly" ? 7 : freq === "monthly" ? 30 : 365);
  for (let i = startIndex; i < sorted.length; i++) {
    const nav = Number(sorted[i].nav);
    let value = units * nav;
    if (counter % step(frequency) === 0 && i !== startIndex) {
      const withdrawUnits = withdrawal / nav;
      units = Math.max(0, units - withdrawUnits);
      value = units * nav;
    }
    series.push(parseFloat(value.toFixed(2)));
    counter += 1;
  }
  return series;
}

function simulateSIPSeries(navHistory, sipAmount, frequency, startDateStr, endDateStr) {
  if (!Array.isArray(navHistory) || navHistory.length === 0) return [];
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);
  const sortedNav = [...navHistory]
    .filter((n) => n && n.nav != null)
    .sort((a, b) => parseISO(a.date) - parseISO(b.date));
  const values = [];
  let totalUnits = 0;
  for (let i = 0; i < sortedNav.length; i++) {
    const d = parseISO(sortedNav[i].date);
    if (d < start || d > end) continue;
    const nav = Number(sortedNav[i].nav);
    // invest on period boundaries roughly by day step counts
    const dayIndex = i;
    const shouldInvest = frequency === "weekly" ? dayIndex % 7 === 0 : frequency === "yearly" ? dayIndex % 365 === 0 : dayIndex % 30 === 0;
    if (shouldInvest) totalUnits += sipAmount / nav;
    values.push(parseFloat((totalUnits * nav).toFixed(2)));
  }
  return values;
}
