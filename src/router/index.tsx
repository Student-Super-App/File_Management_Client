import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/components/layout/public";
import { DashboardLayout } from "@/components/layout/dashboard";
import { AdminLayout } from "@/components/layout/admin";

// Guards
import {
  PublicOnlyRoute,
  CustomerRoute,
  AdminRoute,
} from "@/components/guards";

// Public Pages
import { LandingPage, PricingPage, DocsPage } from "@/pages/public";

// Auth Pages
import { LoginPage, RegisterPage } from "@/pages/auth";

// Dashboard Pages
import {
  DashboardHomePage,
  ProjectsPage,
  ApiKeysPage,
  UploadsPage,
  AssetsPage,
  UsagePage,
  BillingPage,
  SettingsPage,
} from "@/pages/dashboard";

// Admin Pages
import {
  AdminOverviewPage,
  AdminUsersPage,
  AdminHealthPage,
} from "@/pages/admin";

// Error Pages
import { NotFoundPage, ForbiddenPage } from "@/components/common";

// ============================================
// ROUTER CONFIGURATION
// ============================================

const router = createBrowserRouter([
  // ========================================
  // PUBLIC ROUTES
  // ========================================
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "docs",
        element: <DocsPage />,
      },
    ],
  },

  // ========================================
  // AUTH ROUTES (Public Only)
  // ========================================
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },

  // ========================================
  // CUSTOMER DASHBOARD ROUTES
  // ========================================
  {
    path: "/dashboard",
    element: (
      <CustomerRoute>
        <DashboardLayout />
      </CustomerRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "api-keys",
        element: <ApiKeysPage />,
      },
      {
        path: "uploads",
        element: <UploadsPage />,
      },
      {
        path: "assets",
        element: <AssetsPage />,
      },
      {
        path: "usage",
        element: <UsagePage />,
      },
      {
        path: "billing",
        element: <BillingPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },

  // ========================================
  // ADMIN ROUTES
  // ========================================
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminOverviewPage />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />, // Can reuse with admin context
      },
      {
        path: "usage",
        element: <UsagePage />, // Can reuse with admin context
      },
      {
        path: "billing",
        element: <BillingPage />, // Can reuse with admin context
      },
      {
        path: "health",
        element: <AdminHealthPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },

  // ========================================
  // ERROR ROUTES
  // ========================================
  {
    path: "/forbidden",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

// ============================================
// APP ROUTER COMPONENT
// ============================================

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
