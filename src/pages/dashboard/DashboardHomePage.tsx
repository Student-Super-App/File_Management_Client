import { useAppSelector } from "@/app/store/store";
import { useCurrentUsage } from "@/hooks";
import { PageHeader, StatsCard } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderKanban,
  Image,
  HardDrive,
  Activity,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Key,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ============================================
// SAMPLE DATA FOR CHARTS
// ============================================

const storageData = [
  { date: "Jan", storage: 85 },
  { date: "Feb", storage: 92 },
  { date: "Mar", storage: 105 },
  { date: "Apr", storage: 118 },
  { date: "May", storage: 128 },
  { date: "Jun", storage: 135 },
  { date: "Jul", storage: 143 },
];

const bandwidthData = [
  { date: "Jan", bandwidth: 1.8 },
  { date: "Feb", bandwidth: 2.0 },
  { date: "Mar", bandwidth: 2.1 },
  { date: "Apr", bandwidth: 2.2 },
  { date: "May", bandwidth: 2.3 },
  { date: "Jun", bandwidth: 2.35 },
  { date: "Jul", bandwidth: 2.4 },
];

const recentActivity = [
  {
    action: "New asset uploaded",
    project: "Production",
    time: "2 minutes ago",
  },
  { action: "API key created", project: "Staging", time: "1 hour ago" },
  {
    action: "Asset deleted",
    project: "Development",
    time: "3 hours ago",
  },
  { action: "Project created", project: "Testing", time: "5 hours ago" },
  {
    action: "Storage limit increased",
    project: "Production",
    time: "1 day ago",
  },
];

// ============================================
// DASHBOARD HOME PAGE
// ============================================

export function DashboardHomePage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: usage, isLoading } = useCurrentUsage();

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
        description="Here's what's happening with your projects today."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <ArrowUp className="h-4 w-4" />
                    <span>+12.3%</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">
                  {((usage?.storage.used || 0) / 1024 / 1024 / 1024).toFixed(2)} GB
                </div>
                <div className="text-sm text-muted-foreground">Total Storage</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Activity className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <ArrowUp className="h-4 w-4" />
                    <span>+8.1%</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">
                  {((usage?.bandwidth.used || 0) / 1024 / 1024 / 1024).toFixed(2)} TB
                </div>
                <div className="text-sm text-muted-foreground">Bandwidth</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Image className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <ArrowUp className="h-4 w-4" />
                    <span>+324</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">24,583</div>
                <div className="text-sm text-muted-foreground">Total Assets</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>No change</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">8</div>
                <div className="text-sm text-muted-foreground">Active API Keys</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Storage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Usage</CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 months (GB)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={storageData}>
                <defs>
                  <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
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
                <Area
                  type="monotone"
                  dataKey="storage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorStorage)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bandwidth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bandwidth Usage</CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 months (TB)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={bandwidthData}>
                <defs>
                  <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
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
                <Area
                  type="monotone"
                  dataKey="bandwidth"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fill="url(#colorBandwidth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Billing and Activity Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Billing Cycle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Billing Cycle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Billing period</span>
              <span className="text-sm font-medium">Jan 1 - Jan 31, 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current plan</span>
              <span className="text-sm font-medium">Pro Plan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly cost</span>
              <span className="text-sm font-medium">$49.00</span>
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Storage ({((usage?.storage.used || 0) / 1024 / 1024 / 1024).toFixed(1)} GB / {((usage?.storage.limit || 0) / 1024 / 1024 / 1024).toFixed(0)} GB)
                </span>
                <span className="text-sm font-medium">
                  {usage?.storage.limit ? Math.round((usage.storage.used / usage.storage.limit) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${usage?.storage.limit ? Math.min((usage.storage.used / usage.storage.limit) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Bandwidth ({((usage?.bandwidth.used || 0) / 1024 / 1024 / 1024).toFixed(1)} GB / {((usage?.bandwidth.limit || 0) / 1024 / 1024 / 1024).toFixed(0)} GB)
                </span>
                <span className="text-sm font-medium">
                  {usage?.bandwidth.limit ? Math.round((usage.bandwidth.used / usage.bandwidth.limit) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all"
                  style={{
                    width: `${usage?.bandwidth.limit ? Math.min((usage.bandwidth.used / usage.bandwidth.limit) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {activity.project}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Uploads */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Main Website", "Mobile App", "Marketing"].map((project) => (
                <div
                  key={project}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{project}</p>
                    <p className="text-sm text-muted-foreground">
                      Last updated 2 hours ago
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    234 assets
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-muted flex items-center justify-center"
                >
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardHomePage;
