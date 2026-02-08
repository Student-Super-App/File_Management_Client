// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  withCredentials: true, // For HTTP-only cookies
};

// ============================================
// API ENDPOINTS - Centralized endpoint paths
// ============================================

export const API_ENDPOINTS = {
  // Health
  health: "/health",
  info: "/",
  
  // Auth (JWT)
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    changePassword: "/auth/change-password",
  },
  
  // Projects (JWT)
  projects: {
    list: "/projects",
    create: "/projects",
    getById: (id: string) => `/projects/${id}`,
    getBySlug: (slug: string) => `/projects/slug/${slug}`,
    update: (id: string) => `/projects/${id}`,
    updateProviderConfig: (id: string) => `/projects/${id}/provider-config`,
    delete: (id: string) => `/projects/${id}`,
  },
  
  // API Keys (JWT)
  apiKeys: {
    list: "/api-keys",
    create: "/api-keys",
    getById: (id: string) => `/api-keys/${id}`,
    deactivate: (id: string) => `/api-keys/${id}/deactivate`,
    reactivate: (id: string) => `/api-keys/${id}/reactivate`,
    rotate: (id: string) => `/api-keys/${id}/rotate`,
    delete: (id: string) => `/api-keys/${id}`,
  },
  
  // Uploads (API Key)
  uploads: {
    presign: "/uploads/presign",
    confirm: "/uploads/confirm",
  },
  
  // Assets (API Key)
  assets: {
    list: "/assets",
    getById: (id: string) => `/assets/${id}`,
    getByRef: (ref: string) => `/assets/ref/${encodeURIComponent(ref)}`,
    getSignedUrl: (id: string) => `/assets/${id}/signed-url`,
    updateVisibility: (id: string) => `/assets/${id}/visibility`,
    delete: (id: string) => `/assets/${id}`,
  },
  
  // Usage (JWT)
  usage: {
    storage: "/usage/storage",
    bandwidth: "/usage/bandwidth",
    bandwidthHistory: "/usage/bandwidth/history",
    summary: "/usage/summary",
  },
  
  // Billing (JWT)
  billing: {
    invoices: "/billing/invoices",
    estimate: "/billing/estimate",
    invoiceByMonth: (month: string) => `/billing/invoices/month/${month}`,
    invoiceById: (id: string) => `/billing/invoices/${id}`,
    generateInvoice: "/billing/invoices/generate",
    markPaid: (id: string) => `/billing/invoices/${id}/pay`,
  },
} as const;

// ============================================
// QUERY KEYS - Centralized for TanStack Query
// ============================================

export const QUERY_KEYS = {
  // Auth
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
  },
  // Projects
  projects: {
    all: ["projects"] as const,
    list: (filters?: object) => ["projects", "list", filters] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
  },
  // API Keys
  apiKeys: {
    all: ["apiKeys"] as const,
    byProject: (projectId: string) => ["apiKeys", "project", projectId] as const,
    detail: (id: string) => ["apiKeys", "detail", id] as const,
  },
  // Assets
  assets: {
    all: ["assets"] as const,
    byProject: (projectId: string) => ["assets", "project", projectId] as const,
    detail: (id: string) => ["assets", "detail", id] as const,
  },
  // Usage
  usage: {
    current: ["usage", "current"] as const,
    history: (period: string) => ["usage", "history", period] as const,
  },
  // Billing
  billing: {
    info: ["billing", "info"] as const,
    invoices: ["billing", "invoices"] as const,
  },
  // Admin
  admin: {
    users: {
      all: ["admin", "users"] as const,
      detail: (id: string) => ["admin", "users", id] as const,
    },
    stats: ["admin", "stats"] as const,
  },
} as const;

// ============================================
// STALE TIMES - How long data stays fresh
// ============================================

export const STALE_TIMES = {
  short: 1000 * 60, // 1 minute
  medium: 1000 * 60 * 5, // 5 minutes
  long: 1000 * 60 * 30, // 30 minutes
  infinite: Infinity,
} as const;
