// ============================================
// CORE TYPE DEFINITIONS
// Loosely coupled types for API flexibility
// ============================================

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = "public" | "customer" | "admin";

export interface User {
  _id: string;
  id?: string; // Alias for _id
  email: string;
  name: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  activeProjectId: string | null;
}

// ============================================
// PROJECT TYPES
// ============================================

export type StorageProvider = "aws" | "cloudinary";

export interface ProviderConfig {
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  basePath?: string;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface Project {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  owner?: string;
  provider: StorageProvider;
  providerConfig?: ProviderConfig;
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// API KEY TYPES
// ============================================

export type ApiKeyScope = "read" | "upload" | "delete";

export interface ApiKey {
  _id: string;
  id?: string;
  name: string;
  key?: string; // Only returned on creation
  keyPreview?: string;
  prefix?: string;
  projectId: string;
  project?: Project;
  scopes: ApiKeyScope[];
  permissions?: ApiKeyScope[]; // UI convenience alias for scopes
  isActive?: boolean;
  expiresAt?: string | null;
  lastUsedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// ASSET TYPES
// ============================================

export type AssetVisibility = "public" | "private";
export type AssetStatus = "pending" | "uploaded" | "processing" | "ready" | "failed";

export interface AssetMetadata {
  [key: string]: string | number | boolean;
}

export interface Asset {
  _id: string;
  id?: string;
  filename: string;
  originalName?: string;
  name?: string; // UI convenience alias
  contentType: string;
  type?: string; // UI convenience: 'image' | 'video' | 'document' | 'other'
  size: number;
  projectId: string;
  project?: Project;
  category?: string;
  visibility: AssetVisibility;
  status?: AssetStatus;
  storageRef?: string;
  publicUrl?: string;
  url?: string; // UI convenience alias for publicUrl
  metadata?: AssetMetadata;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// UPLOAD TYPES
// ============================================

export interface PresignedUploadResponse {
  uploadUrl: string;
  assetId: string;
  storageRef: string;
  expiresAt: string;
  fields?: Record<string, string>; // For POST uploads
}

export interface UploadConfirmation {
  asset: Asset;
  publicUrl?: string;
}

// ============================================
// USAGE TYPES
// ============================================

export interface StorageUsage {
  totalBytes?: number;
  usedBytes?: number;
  used?: number; // UI convenience
  limit?: number; // UI convenience
  breakdown?: Array<{
    projectId: string;
    projectName?: string;
    bytes: number;
  }>;
}

export interface BandwidthUsage {
  month?: string;
  totalBytes?: number;
  uploadBytes?: number;
  downloadBytes?: number;
  used?: number; // UI convenience
  limit?: number; // UI convenience
  breakdown?: Array<{
    projectId: string;
    projectName?: string;
    bytes: number;
  }>;
}

export interface RequestsUsage {
  count?: number;
  limit?: number;
  total?: number;
}

export interface UsageSummary {
  storage: StorageUsage;
  bandwidth: BandwidthUsage;
  requests?: RequestsUsage;
  assetCount?: number;
  projectCount?: number;
}

export interface UsageStats {
  storage: {
    used: number;
    limit: number;
  };
  bandwidth: {
    used: number;
    limit: number;
  };
  requests: {
    count: number;
    limit: number;
  };
  period: string;
}

// ============================================
// BILLING TYPES
// ============================================

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id: string;
  id?: string;
  userId: string;
  month: string;
  date?: string; // UI convenience
  status: InvoiceStatus;
  amount: number;
  currency?: string;
  lineItems?: InvoiceLineItem[];
  paidAt?: string | null;
  dueDate?: string;
  pdfUrl?: string; // Download link
  createdAt?: string;
  updatedAt?: string;
}

export interface BillingEstimate {
  month?: string;
  estimatedAmount?: number;
  currency?: string;
  breakdown?: {
    storage?: number;
    bandwidth?: number;
    requests?: number;
  };
  // UI convenience fields
  plan?: "free" | "pro" | "enterprise";
  status?: "active" | "past_due" | "cancelled";
  currentPeriodEnd?: string;
  amount?: number;
}

export interface BillingInfo {
  plan: "free" | "pro" | "enterprise";
  status: "active" | "past_due" | "cancelled";
  currentPeriodEnd?: string;
  amount?: number;
}

// ============================================
// SETTINGS TYPES
// ============================================

export type ThemeMode = "light" | "dark" | "system";
export type RadiusSize = "sm" | "md" | "lg";
export type FontScale = "sm" | "md" | "lg";
export type SidebarDensity = "compact" | "comfortable";

export interface ThemeColors {
  primary: string;
  secondary: string;
}

export interface SettingsState {
  theme: ThemeMode;
  colors: ThemeColors;
  radius: RadiusSize;
  fontScale: FontScale;
  sidebarDensity: SidebarDensity;
}

// ============================================
// API RESPONSE TYPES (Flexible/Loosely Coupled)
// ============================================

/**
 * Standard API response wrapper
 * Flexible to handle various backend response formats
 */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

/**
 * Paginated response with flexible structure
 */
export interface PaginatedResponse<T = unknown> {
  success?: boolean;
  data?: T[];
  items?: T[]; // Alternative field name
  total?: number;
  count?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
  totalPages?: number;
  hasMore?: boolean;
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// ============================================
// AUTH API TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  // Legacy alias
  token?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================
// PROJECT API TYPES
// ============================================

export interface CreateProjectRequest {
  name: string;
  description?: string;
  provider?: StorageProvider;
  providerConfig?: ProviderConfig;
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
  isActive?: boolean;
}

export interface UpdateProviderConfigRequest {
  providerConfig: ProviderConfig;
}

// ============================================
// API KEY API TYPES
// ============================================

export interface CreateApiKeyRequest {
  projectId: string;
  name: string;
  scopes: ApiKeyScope[];
  prefix?: string;
  expiresAt?: string | null;
}

// ============================================
// UPLOAD API TYPES
// ============================================

export interface PresignUploadRequest {
  filename: string;
  contentType: string;
  fileSize: number;
  category?: string;
  visibility?: AssetVisibility;
  metadata?: AssetMetadata;
}

export interface ConfirmUploadRequest {
  assetId: string;
}

// ============================================
// ASSET API TYPES
// ============================================

export interface ListAssetsParams {
  category?: string;
  visibility?: AssetVisibility;
  page?: number;
  limit?: number;
}

export interface UpdateAssetVisibilityRequest {
  visibility: AssetVisibility;
}

// ============================================
// USAGE API TYPES
// ============================================

export interface GetBandwidthParams {
  month?: string; // YYYY-MM format
  projectId?: string;
}

export interface GetStorageParams {
  projectId?: string;
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Extract the actual data from various response formats
 */
export type ExtractData<T> = T extends { data: infer D } ? D : T;

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
