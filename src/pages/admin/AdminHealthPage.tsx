import { PageHeader, StatsCard } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Database, Cpu, CheckCircle, AlertCircle } from "lucide-react";

// ============================================
// ADMIN SYSTEM HEALTH PAGE
// ============================================

export function AdminHealthPage() {
  const services = [
    { name: "API Server", status: "healthy", latency: "45ms", uptime: "99.99%" },
    { name: "Database", status: "healthy", latency: "12ms", uptime: "99.95%" },
    { name: "CDN", status: "healthy", latency: "23ms", uptime: "99.99%" },
    { name: "Storage", status: "healthy", latency: "89ms", uptime: "99.90%" },
    { name: "Worker Queue", status: "degraded", latency: "234ms", uptime: "98.50%" },
    { name: "Email Service", status: "healthy", latency: "156ms", uptime: "99.80%" },
  ];

  const getStatusIcon = (status: string) => {
    return status === "healthy" ? (
      <CheckCircle className="h-5 w-5 text-success" />
    ) : (
      <AlertCircle className="h-5 w-5 text-warning" />
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "healthy" ? (
      <Badge className="bg-success text-primary-foreground">Healthy</Badge>
    ) : (
      <Badge className="bg-warning text-primary-foreground">Degraded</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health"
        description="Monitor system performance and service status."
      />

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="CPU Usage"
          value="42%"
          description="Average across all servers"
          icon={Cpu}
        />
        <StatsCard
          title="Memory Usage"
          value="68%"
          description="12.4 GB of 18 GB"
          icon={Server}
        />
        <StatsCard
          title="Database Load"
          value="23%"
          description="340 active connections"
          icon={Database}
        />
        <StatsCard
          title="Request Rate"
          value="1.2K/s"
          description="Current throughput"
          icon={Activity}
        />
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Latency: {service.latency}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.uptime}</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-warning/50 bg-warning/10">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Worker Queue Degradation</p>
                <Badge className="bg-warning text-primary-foreground">Investigating</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Increased latency detected in the worker queue. Team is
                investigating.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Started: 2 hours ago
              </p>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">CDN Cache Invalidation</p>
                <Badge variant="secondary">Resolved</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Temporary issues with CDN cache invalidation. Issue has been
                resolved.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Resolved: 1 day ago • Duration: 15 minutes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminHealthPage;
