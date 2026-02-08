import { useBillingInfo, useInvoices } from "@/hooks";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Download, Check } from "lucide-react";

// ============================================
// SAMPLE DATA
// ============================================

const currentPlan = {
  name: "Pro Plan",
  price: 49,
  period: "month",
  features: [
    "200 GB storage",
    "5 TB bandwidth",
    "Unlimited projects",
    "Unlimited API keys",
    "99.9% uptime SLA",
    "Priority support",
  ],
};

const plans = [
  {
    name: "Starter",
    price: 0,
    storage: "10 GB",
    bandwidth: "100 GB",
    features: ["Basic support", "1 project", "3 API keys"],
  },
  {
    name: "Pro",
    price: 49,
    storage: "200 GB",
    bandwidth: "5 TB",
    features: ["Priority support", "Unlimited projects", "Unlimited API keys"],
    current: true,
  },
  {
    name: "Enterprise",
    price: 199,
    storage: "1 TB",
    bandwidth: "25 TB",
    features: [
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];

const sampleInvoices = [
  {
    id: "INV-2026-002",
    date: "2026-02-01",
    amount: 49.0,
    status: "paid",
    period: "Feb 1 - Feb 28, 2026",
  },
  {
    id: "INV-2026-001",
    date: "2026-01-01",
    amount: 49.0,
    status: "paid",
    period: "Jan 1 - Jan 31, 2026",
  },
  {
    id: "INV-2025-012",
    date: "2025-12-01",
    amount: 49.0,
    status: "paid",
    period: "Dec 1 - Dec 31, 2025",
  },
  {
    id: "INV-2025-011",
    date: "2025-11-01",
    amount: 49.0,
    status: "paid",
    period: "Nov 1 - Nov 30, 2025",
  },
  {
    id: "INV-2025-010",
    date: "2025-10-01",
    amount: 29.0,
    status: "paid",
    period: "Oct 1 - Oct 31, 2025",
  },
];

const usageSummary = [
  { metric: "Storage used", value: "142.8 GB", limit: "200 GB", percentage: 71 },
  { metric: "Bandwidth used", value: "2.4 TB", limit: "5 TB", percentage: 48 },
  { metric: "Projects", value: "4", limit: "Unlimited", percentage: 0 },
  { metric: "API Keys", value: "8", limit: "Unlimited", percentage: 0 },
];

// ============================================
// BILLING PAGE
// ============================================

export function BillingPage() {
//   const { data: billing, isLoading: billingLoading } = useBillingInfo();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Billing & Subscription"
        description="Manage your plan and payment information"
      />

      {/* Current Plan - Gradient Card */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 text-primary-foreground">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h2 className="text-2xl font-semibold">{currentPlan.name}</h2>
              <span className="px-3 py-1 bg-primary-foreground/20 rounded-full text-sm font-medium">
                Current Plan
              </span>
            </div>
            <p className="text-primary-foreground/80">
              Billing period: Feb 1 - Feb 28, 2026
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-semibold mb-1">
              ${currentPlan.price}
            </div>
            <div className="text-primary-foreground/80">per {currentPlan.period}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Upgrade Plan
          </Button>
          <Button variant="outline" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground">
            Update Payment Method
          </Button>
        </div>
      </div>

      {/* Usage Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usageSummary.map((item) => (
            <div key={item.metric}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.metric}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value} {item.limit !== "Unlimited" && `/ ${item.limit}`}
                </span>
              </div>
              {item.percentage > 0 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.percentage > 80
                        ? "bg-destructive"
                        : item.percentage > 60
                        ? "bg-warning"
                        : "bg-primary"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.current
                  ? "border-primary border-2 bg-primary/5"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.current && (
                    <Badge className="bg-primary text-primary-foreground">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="font-medium">{plan.storage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bandwidth:</span>
                    <span className="font-medium">{plan.bandwidth}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.current ? "secondary" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">
                •••• •••• •••• 4242
              </div>
              <div className="text-xs text-muted-foreground">Expires 12/2027</div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Invoice History</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Download past invoices and receipts
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !invoices?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Billing Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <span className="font-mono text-sm">{invoice.id}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invoice.period}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success text-primary-foreground">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "paid" ? "default" : "secondary"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={invoice.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BillingPage;
