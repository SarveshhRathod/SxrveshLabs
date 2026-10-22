/**
 * SxrveshLabs Runner — Core Data Models & TypeScript Interfaces
 * Defines full data schemas matching Supabase PostgreSQL tables & the official Python SDK contract.
 */

export type UserRole = 'admin' | 'seller' | 'customer';
export type AccountStatus = 'active' | 'suspended' | 'pending';
export type ExecutionMode = 'local' | 'server' | 'hybrid';
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'revoked' | 'pending';
export type SessionStatus = 'active' | 'revoked' | 'expired';
export type ExecutionStatus = 'starting' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * 1. Profiles Table (Linked to Supabase Auth)
 */
export interface Profile {
  id: string; // Supabase auth.users UUID
  email: string;
  display_name: string;
  role: UserRole;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
}

/**
 * 2. Sellers Table (Tenant Isolation Root)
 */
export interface Seller {
  id: string; // e.g. "sel_..."
  owner_id: string; // references profiles(id)
  seller_name: string;
  contact_email: string;
  status: AccountStatus;
  created_at: string;
}

/**
 * 3. Scripts Table
 */
export interface Script {
  id: string; // e.g. "scr_..."
  seller_id: string; // references sellers(id)
  name: string;
  description: string;
  current_version: string;
  storage_path: string;
  file_hash: string; // SHA-256 hex
  execution_mode: ExecutionMode;
  status: 'active' | 'deprecated' | 'suspended';
  runtime_requirements: string[]; // e.g. ["python>=3.10", "requests", "numpy"]
  created_at: string;
  updated_at: string;
}

/**
 * 4. Script Versions Table
 */
export interface ScriptVersion {
  id: string;
  script_id: string; // references scripts(id)
  version_number: string; // SemVer string
  storage_path: string;
  file_hash: string;
  release_notes: string;
  created_at: string;
}

/**
 * 5. Customers Table (Seller-Customer relationship)
 */
export interface Customer {
  id: string; // e.g. "cst_..."
  seller_id: string; // references sellers(id)
  user_id: string; // references profiles(id)
  status: AccountStatus;
  created_at: string;
}

/**
 * 6. Purchases Table
 */
export interface Purchase {
  id: string;
  customer_id: string;
  script_id: string;
  payment_reference?: string;
  purchase_status: 'completed' | 'refunded' | 'pending';
  purchase_timestamp: string;
}

/**
 * 7. Licenses Table (Authoritative license state)
 */
export interface License {
  id: string;
  customer_id: string;
  script_id: string;
  status: LicenseStatus;
  start_date: string; // ISO 8601
  expiration_date: string; // ISO 8601
  device_limit: number; // typically 1 for one-active-device policy
  created_at: string;
  updated_at: string;
}

/**
 * 8. Device Sessions Table (Enforces single-active-session policy)
 */
export interface DeviceSession {
  id: string;
  customer_id: string;
  device_identifier: string; // client-provided hardware/client signature
  device_name?: string;
  session_status: SessionStatus;
  created_at: string;
  last_activity: string;
  expiration_timestamp: string;
}

/**
 * 9. Execution Sessions Table
 */
export interface ExecutionSession {
  id: string;
  customer_id: string;
  script_id: string;
  script_version_id: string;
  execution_mode: ExecutionMode;
  execution_status: ExecutionStatus;
  start_time: string;
  finish_time?: string;
  exit_code?: number;
  stdout_preview?: string;
  stderr_preview?: string;
}

/**
 * 10. Audit Logs Table
 */
export interface AuditLog {
  id: string;
  actor_id: string;
  seller_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  safe_metadata: Record<string, unknown>;
  ip_address_hash?: string;
  timestamp: string;
}

/**
 * Python SDK: sxrvesh_runner contract
 */
export interface SdkLicenseCheckRequest {
  script_id: string;
  customer_token: string;
  device_identifier: string;
  sdk_version: string;
}

export interface SdkLicenseCheckResponse {
  allowed: boolean;
  license_id?: string;
  customer_id?: string;
  status: LicenseStatus;
  expires_at?: string;
  heartbeat_interval_seconds?: number;
  reason?: string;
}

export interface SdkHeartbeatRequest {
  session_id: string;
  script_id: string;
  timestamp: string;
}

export interface SdkHeartbeatResponse {
  valid: boolean;
  must_terminate: boolean;
  reason?: string;
}
