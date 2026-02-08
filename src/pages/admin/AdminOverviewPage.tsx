import { PageHeader, StatsCard } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, HardDrive, DollarSign, Activity } from "lucide-react";

// ============================================
// ADMIN OVERVIEW PAGE
// ============================================

export function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Overview"
        description="System-wide statistics and insights."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="12,345"
          description="+234 this month"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Projects"
          value="45,678"
          description="+1,234 this month"
          icon={FolderKanban}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Storage"
          value="2.4 TB"
          description="78% capacity"
          icon={HardDrive}
        />
        <StatsCard
          title="Monthly Revenue"
          value="$128,450"
          description="+$12,340 vs last month"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart placeholder - User growth over time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart placeholder - Revenue over time
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New user registered", user: "john@example.com", time: "2 minutes ago" },
              { action: "Project created", user: "jane@example.com", time: "15 minutes ago" },
              { action: "Plan upgraded to Pro", user: "bob@example.com", time: "1 hour ago" },
              { action: "New user registered", user: "alice@example.com", time: "2 hours ago" },
              { action: "Support ticket opened", user: "charlie@example.com", time: "3 hours ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.user}</p>
                </div>
                <span className="text-sm text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminOverviewPage;
