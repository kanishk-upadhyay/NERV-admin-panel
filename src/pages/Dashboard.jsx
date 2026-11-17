import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectTotalUsers,
  selectActiveUsers,
  selectTotalProducts,
  selectOrderRevenue,
  selectTotalOrders,
  selectCategoryCount,
  selectAverageProductPrice,
  selectAllProducts,
  selectAllOrders,
  selectTheme,
} from "../store/selectors";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import StatCard from "../components/common/StatCard";
import PageHeader from "../components/common/PageHeader";
import { formatCurrency } from "../utils/format";

const MAGI_COLORS = ["#ffa000", "#00e5ff", "#ff5252", "#00e676", "#e040fb", "#ffd54f"];
const STANDARD_COLORS = ["#6750a4", "#ff6b9d", "#006a60", "#006c4c", "#b388ff", "#e06d53"];

/**
 * Dashboard Page - Displays key telemetry, StatCards, and time-series Recharts charts.
 */
const Dashboard = () => {
  const theme = useSelector(selectTheme);
  const totalUsers = useSelector(selectTotalUsers);
  const activeUsers = useSelector(selectActiveUsers);
  const totalProducts = useSelector(selectTotalProducts);
  const totalRevenue = useSelector(selectOrderRevenue);
  const totalOrders = useSelector(selectTotalOrders);
  const categoryCount = useSelector(selectCategoryCount);
  const avgPrice = useSelector(selectAverageProductPrice);
  const products = useSelector(selectAllProducts);
  const orders = useSelector(selectAllOrders);

  const [timeRange, setTimeRange] = useState(30);

  // Aggregate actual order telemetry from Redux store by date
  const timeSeriesData = useMemo(() => {
    const days = timeRange;
    const data = [];

    // Map all orders by ISO date (YYYY-MM-DD)
    const ordersByDate = {};
    orders.forEach((order) => {
      if (!order.date) return;
      if (!ordersByDate[order.date]) {
        ordersByDate[order.date] = { count: 0, revenue: 0 };
      }
      ordersByDate[order.date].count += 1;
      ordersByDate[order.date].revenue += parseFloat(order.total) || 0;
    });

    // Anchor time window to the latest order in the database (or current date if recent)
    let anchorDate = new Date();
    const orderDates = Object.keys(ordersByDate).sort();
    if (orderDates.length > 0) {
      const latestOrderStr = orderDates[orderDates.length - 1];
      const parsedLatest = new Date(latestOrderStr + "T00:00:00");
      if (!isNaN(parsedLatest.getTime())) {
        anchorDate = parsedLatest;
      }
    }

    // Step backwards through the selected time range window (7, 14, or 30 days)
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(anchorDate);
      d.setDate(d.getDate() - i);
      const isoStr = d.toISOString().split("T")[0];
      const displayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const dayStats = ordersByDate[isoStr];

      data.push({
        date: displayLabel,
        isoDate: isoStr,
        revenue: dayStats ? dayStats.revenue : 0,
        orders: dayStats ? dayStats.count : 0,
      });
    }

    return data;
  }, [orders, timeRange]);

  // Product Category Distribution for Donut Chart
  const categoryDistribution = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const chartPalette = theme === "magi" ? MAGI_COLORS : STANDARD_COLORS;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Unified Page Header (Consistently at top of all views) */}
      <PageHeader
        title="Executive Dashboard"
        magiTitle="MAGI SYSTEM TELEMETRY"
        description="Real-time operational metrics, time-series telemetry, and logistics volume tracking."
      >
        {/* Time-Range Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface border border-outline-variant/40 text-xs font-mono self-start sm:self-auto">
          {[
            { label: "7 Days", value: 7 },
            { label: "14 Days", value: 14 },
            { label: "30 Days", value: 30 },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                timeRange === r.value
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* MAGI Tactical Telemetry & Tri-Computer Consensus Module */}
      {theme === "magi" && (
        <div className="space-y-4">
          {/* Tactical Status Banner */}
          <div className="p-4 rounded bg-surface border-2 border-primary text-xs font-mono space-y-2 magi-hex-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-primary/40 pb-2 gap-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="w-2.5 h-2.5 bg-primary rounded-xs" />
                <span className="tracking-wider">MAGI-01 SUPERCOMPUTER // CENTRAL DOGMA TOKYO-3</span>
              </div>
              <div className="text-primary font-bold">
                DEFCON 1 // CODE: 707 // SYSTEM INTEGRITY: 99.8%
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-on-surface pt-1">
              <div>SYNC RATE: <span className="text-primary font-bold">98.4%</span></div>
              <div>INTERNAL POWER: <span className="text-success font-bold">100% ONLINE</span></div>
              <div>BLOOD PATTERN: <span className="text-primary font-bold">BLUE NULL</span></div>
              <div>CLEARANCE: <span className="text-primary font-bold">LEVEL-AAA</span></div>
            </div>
          </div>

          {/* Authentic Evangelion Tri-Computer Consensus Module */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* MELCHIOR-1 (Dr. Naoko Akagi as Scientist) */}
            <div className="p-4 rounded bg-surface border-2 border-success/80 magi-hex-card space-y-2">
              <div className="flex items-center justify-between border-b border-success/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-black text-sm text-success tracking-wider">MAGI-1 // MELCHIOR</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-success/20 text-success font-bold border border-success/50 text-[11px]">
                  AGREE
                </span>
              </div>
              <div className="space-y-1.5 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>FACULTY:</span>
                  <span className="text-on-surface font-semibold">SCIENTIST (LOGIC)</span>
                </div>
                <div className="flex justify-between">
                  <span>TELEMETRY:</span>
                  <span className="text-success font-semibold">99.4% AFFIRMED</span>
                </div>
                <div className="text-[11px] text-on-surface-variant/80 pt-1.5 border-t border-outline-variant/30 [text-wrap:pretty]">
                  Fiscal trajectory & revenue telemetry cleared within operational limits.
                </div>
              </div>
            </div>

            {/* BALTHASAR-2 (Dr. Naoko Akagi as Mother) */}
            <div className="p-4 rounded bg-surface border-2 border-success/80 magi-hex-card space-y-2">
              <div className="flex items-center justify-between border-b border-success/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-black text-sm text-success tracking-wider">MAGI-2 // BALTHASAR</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-success/20 text-success font-bold border border-success/50 text-[11px]">
                  AGREE
                </span>
              </div>
              <div className="space-y-1.5 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>FACULTY:</span>
                  <span className="text-on-surface font-semibold">MOTHER (PROTECTION)</span>
                </div>
                <div className="flex justify-between">
                  <span>TELEMETRY:</span>
                  <span className="text-success font-semibold">98.9% AFFIRMED</span>
                </div>
                <div className="text-[11px] text-on-surface-variant/80 pt-1.5 border-t border-outline-variant/30 [text-wrap:pretty]">
                  Personnel safety reserves and order fulfillments verified.
                </div>
              </div>
            </div>

            {/* CASPER-3 (Dr. Naoko Akagi as Woman) */}
            <div className="p-4 rounded bg-surface border-2 border-primary magi-hex-card space-y-2">
              <div className="flex items-center justify-between border-b border-primary/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="font-black text-sm text-primary tracking-wider">MAGI-3 // CASPER</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold border border-primary/50 text-[11px]">
                  DELIBERATING
                </span>
              </div>
              <div className="space-y-1.5 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>FACULTY:</span>
                  <span className="text-on-surface font-semibold">WOMAN (INSTINCT)</span>
                </div>
                <div className="flex justify-between">
                  <span>TELEMETRY:</span>
                  <span className="text-primary font-semibold">84.2% EVALUATING</span>
                </div>
                <div className="text-[11px] text-on-surface-variant/80 pt-1.5 border-t border-outline-variant/30 [text-wrap:pretty]">
                  Cross-referencing pending dispatch manifests for anomalous variance.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Heading to satisfy Heading Hierarchy (h1 -> h2 -> h3) */}
      <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-on-surface-variant font-mono">
        Core Readiness Metrics
      </h2>

      {/* Key Metric StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon="👥"
          title="Total Personnel"
          value={totalUsers}
          colorClass="bg-primary"
        />
        <StatCard
          icon="✅"
          title="Active Clearance"
          value={activeUsers}
          colorClass="bg-success"
        />
        <StatCard
          icon="📦"
          title="Tactical Inventory"
          value={totalProducts}
          colorClass="bg-secondary"
        />
        <StatCard
          icon="💰"
          title="Total Requisitions"
          value={formatCurrency(totalRevenue)}
          colorClass="bg-tertiary"
        />
      </div>

      {/* Recharts Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-Series Line/Area Chart */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl bg-surface border ${
            theme === "magi" ? "border-primary/50 font-mono shadow-sm" : "border-outline-variant/30 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/30">
            <div>
              <h2 className={`text-lg font-bold ${theme === "magi" ? "text-primary" : "text-on-surface"}`}>
                Operational Volume Trends ({timeRange}-Day Window)
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Dual telemetry tracking requisition value ($k) and dispatch volume
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-bold">
              {timeSeriesData.length} BATCHES
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="telemetryRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartPalette[0]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={chartPalette[0]} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="telemetryOrdersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartPalette[1]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartPalette[1]} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "magi" ? "#0a0a0c" : theme === "dark" ? "#1e1b24" : "#ffffff",
                    borderColor: chartPalette[0],
                    borderRadius: "8px",
                    fontFamily: theme === "magi" ? "monospace" : "inherit",
                    color: theme === "light" ? "#1d1b20" : "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                  formatter={(value, name) => [
                    name === "Requisition Value ($)" ? formatCurrency(value) : `${value} manifests`,
                    name,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Requisition Value ($)"
                  stroke={chartPalette[0]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#telemetryRevenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Volume"
                  stroke={chartPalette[1]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#telemetryOrdersGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Donut Chart */}
        <div
          className={`p-6 rounded-2xl bg-surface border ${
            theme === "magi" ? "border-primary/50 font-mono shadow-sm" : "border-outline-variant/30 shadow-sm"
          }`}
        >
          <div className="mb-4 pb-2 border-b border-outline-variant/30">
            <h2 className={`text-lg font-bold ${theme === "magi" ? "text-primary" : "text-on-surface"}`}>
              Inventory Allocations
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Category split across registered assets
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartPalette[index % chartPalette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "magi" ? "#0b0d10" : "#ffffff",
                    borderColor: chartPalette[0],
                    borderRadius: "8px",
                    fontFamily: theme === "magi" ? "monospace" : "inherit",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-outline-variant/20 text-xs font-mono">
            {categoryDistribution.slice(0, 4).map((c, idx) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: chartPalette[idx % chartPalette.length] }} />
                <span className="text-on-surface-variant truncate">{c.name}:</span>
                <span className="font-bold text-on-surface">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
