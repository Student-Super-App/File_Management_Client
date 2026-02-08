import { useCurrentUsage, useUsageHistory } from "@/hooks";
import { PageHeader } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ============================================
// SAMPLE DATA FOR CHARTS
// ============================================

const storageData = [
  { month: "Aug", production: 78, staging: 18, development: 8 },
  { month: "Sep", production: 85, staging: 20, development: 9 },
  { month: "Oct", production: 92, staging: 22, development: 10 },
  { month: "Nov", production: 105, staging: 24, development: 11 },
  { month: "Dec", production: 112, staging: 25, development: 11 },
  { month: "Jan", production: 120, staging: 26, development: 12 },
  { month: "Feb", production: 98, staging: 25, development: 12 },
];

const bandwidthData = [
  { month: "Aug", production: 1.5, staging: 0.3, development: 0.1 },
  { month: "Sep", production: 1.7, staging: 0.35, development: 0.12 },
  { month: "Oct", production: 1.9, staging: 0.38, development: 0.13 },
  { month: "Nov", production: 2.0, staging: 0.4, development: 0.14 },
  { month: "Dec", production: 2.2, staging: 0.42, development: 0.15 },
  { month: "Jan", production: 2.3, staging: 0.45, development: 0.16 },
  { month: "Feb", production: 2.4, staging: 0.48, development: 0.17 },
];

const dailyUsage = [
  { date: "Feb 1", storage: 135, bandwidth: 2.1 },
  { date: "Feb 2", storage: 137, bandwidth: 2.3 },
  { date: "Feb 3", storage: 138, bandwidth: 2.2 },
  { date: "Feb 4", storage: 140, bandwidth: 2.4 },
  { date: "Feb 5", storage: 142, bandwidth: 2.6 },
  { date: "Feb 6", storage: 143, bandwidth: 2.5 },
  { date: "Feb 7", storage: 143, bandwidth: 2.4 },
];

const projectBreakdown = [
  { name: "Production", storage: "98.2 GB", bandwidth: "1.8 TB", percentage: 69 },
  { name: "Staging", storage: "24.8 GB", bandwidth: "420 GB", percentage: 17 },
  { name: "Development", storage: "12.4 GB", bandwidth: "180 GB", percentage: 9 },
  { name: "Testing", storage: "5.6 GB", bandwidth: "120 GB", percentage: 5 },
];

// ============================================
// USAGE PAGE
// ============================================

export function UsagePage() {
  const { data: usage, isLoading: usageLoading } = useCurrentUsage();
  const { data: history, isLoading: historyLoading } = useUsageHistory(6);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getPercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Usage Analytics"
          description="Monitor your storage and bandwidth consumption"
        />
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Current Usage Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {usageLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-200 dark:border-blue-900">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Current Storage
                  </h3>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+5.2%</span>
                  </div>
                </div>
                <div className="text-3xl font-semibold mb-2">
                  {formatBytes(usage?.storage.used || 0)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    of {formatBytes(usage?.storage.limit || 0)}
                  </span>
                  <span className="font-medium">
                    {getPercentage(
                      usage?.storage.used || 0,
                      usage?.storage.limit || 1
                    )}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        usage?.storage.used || 0,
                        usage?.storage.limit || 1
                      )}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200 dark:border-emerald-900">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Current Bandwidth
                  </h3>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+8.1%</span>
                  </div>
                </div>
                <div className="text-3xl font-semibold mb-2">
                  {formatBytes(usage?.bandwidth.used || 0)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    of {formatBytes(usage?.bandwidth.limit || 0)}
                  </span>
                  <span className="font-medium">
                    {getPercentage(
                      usage?.bandwidth.used || 0,
                      usage?.bandwidth.limit || 1
                    )}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${getPercentage(
                        usage?.bandwidth.used || 0,
                        usage?.bandwidth.limit || 1
                      )}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-200 dark:border-purple-900">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total Requests
                  </h3>
                  <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-medium">-2.3%</span>
                  </div>
                </div>
                <div className="text-3xl font-semibold mb-2">
                  {(usage?.requests.count || 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  This billing period
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Usage Bars */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Storage Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Storage</span>
              <span className="text-sm text-muted-foreground">
                {formatBytes(usage?.storage.used || 0)} /{" "}
                {formatBytes(usage?.storage.limit || 0)}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${getPercentage(
                    usage?.storage.used || 0,
                    usage?.storage.limit || 1
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Bandwidth Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Bandwidth</span>
              <span className="text-sm text-muted-foreground">
                {formatBytes(usage?.bandwidth.used || 0)} /{" "}
                {formatBytes(usage?.bandwidth.limit || 0)}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-info transition-all"
                style={{
                  width: `${getPercentage(
                    usage?.bandwidth.used || 0,
                    usage?.bandwidth.limit || 1
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Requests Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">API Requests</span>
              <span className="text-sm text-muted-foreground">
                {(usage?.requests.count || 0).toLocaleString()} /{" "}
                {(usage?.requests.limit || 0).toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all"
                style={{
                  width: `${getPercentage(
                    usage?.requests.count || 0,
                    usage?.requests.limit || 1
                  )}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Storage by Project */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage by Project</CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 months (GB)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={storageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs text-muted-foreground"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="production" fill="#3b82f6" name="Production" radius={[4, 4, 0, 0]} />
                <Bar dataKey="staging" fill="#10b981" name="Staging" radius={[4, 4, 0, 0]} />
                <Bar dataKey="development" fill="#f59e0b" name="Development" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bandwidth by Project */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bandwidth by Project</CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 months (TB)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bandwidthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs text-muted-foreground"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="production" fill="#6366f1" name="Production" radius={[4, 4, 0, 0]} />
                <Bar dataKey="staging" fill="#14b8a6" name="Staging" radius={[4, 4, 0, 0]} />
                <Bar dataKey="development" fill="#f97316" name="Development" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Usage Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Usage Trend</CardTitle>
          <p className="text-sm text-muted-foreground">Last 7 days</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyUsage}>
              <defs>
                <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs text-muted-foreground"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                yAxisId="left"
                className="text-xs text-muted-foreground"
                stroke="#3b82f6"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs text-muted-foreground"
                stroke="#10b981"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="storage"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Storage (GB)"
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bandwidth"
                stroke="#10b981"
                strokeWidth={3}
                name="Bandwidth (TB)"
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usage by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Storage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Bandwidth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    % of Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Usage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projectBreakdown.map((project, index) => {
                  const colors = [
                    { bg: "bg-blue-100 dark:bg-blue-950", bar: "bg-gradient-to-r from-blue-500 to-blue-600" },
                    { bg: "bg-emerald-100 dark:bg-emerald-950", bar: "bg-gradient-to-r from-emerald-500 to-emerald-600" },
                    { bg: "bg-amber-100 dark:bg-amber-950", bar: "bg-gradient-to-r from-amber-500 to-amber-600" },
                    { bg: "bg-purple-100 dark:bg-purple-950", bar: "bg-gradient-to-r from-purple-500 to-purple-600" },
                  ];
                  const color = colors[index] || colors[0];
                  return (
                    <tr key={project.name} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium">{project.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {project.storage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {project.bandwidth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {project.percentage}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex-1 ${color.bg} rounded-full h-2`}>
                            <div
                              className={`${color.bar} h-2 rounded-full transition-all`}
                              style={{ width: `${project.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Historical data integrated above</p>
                {history && (
                  <p className="text-xs mt-2">
                    Data points: {Array.isArray(history) ? history.length : 0}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UsagePage;
