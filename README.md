# SxrveshLabs Runner 🚀

**SxrveshLabs Runner** is an enterprise-grade multi-seller Python script licensing, binding SDK, and execution platform. It allows Sellers to protect and monetize their Python scripts, bind them using the official `sxrvesh_runner` SDK, assign time-limited and device-locked licenses to customers, and execute authorized workloads seamlessly on Windows and Android environments.

---

## 🔒 1. Strict Closed-Registration Policy (No Public Self-Signup)

The platform enforces a **hierarchical invitation-only user provisioning model**. Public registration is strictly disabled. No arbitrary visitor can create an account on their own.

```
                  ┌──────────────────────────────┐
                  │        Platform Admin        │
                  │       (Platform Owner)       │
                  └──────────────┬───────────────┘
                                 │
                  Provisions & Activates Sellers
                  (Creates Seller Credentials)
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │       Seller (Tenant)        │
                  │   (Script Publisher/Owner)   │
                  └──────────────┬───────────────┘
                                 │
                  Provisions & Invites Customers
                  (Assigns Script Licenses)
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │       Customer / User        │
                  │    (Authorized End-User)     │
                  └──────────────────────────────┘
```

### Hierarchy Breakdown:
1. **Public Self-Signup is Banned**:
   - In Supabase Auth: **"Enable Signup" is toggled OFF** (`mailer_autoconfirm = false`, public registration disabled).
   - Any attempt to call `auth.signUp()` from unauthenticated clients is rejected.
2. **Admin Role**:
   - The platform owner creates **Seller accounts** and generates initial secure credentials or activation links.
   - Admin can activate, suspend, or revoke any Seller.
   - Admin cannot upload scripts or create customers on behalf of Sellers through ordinary workflows (enforced by RLS & API).
3. **Seller Role (Tenant Isolation)**:
   - Each Seller is an isolated tenant.
   - Sellers create **Customer accounts** for clients who purchase their scripts.
   - The Seller assigns unique Script IDs, defines license start and expiration dates, and grants execution entitlements.
   - Sellers can never view or modify another Seller's scripts, customers, or licenses.
4. **Customer Role**:
   - Customers log in with credentials issued by their Seller.
   - Customers can only see scripts specifically licensed to them.
   - Customers run their authorized scripts under a **1-active-device session policy**.
   - If a customer logs in on a second device, the previous session is immediately invalidated.

---

## 🛠️ 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans & JetBrains Mono typography.
- **Backend & Edge**: Cloudflare Pages (Frontend hosting) + Cloudflare Workers (REST API & Auth verification).
- **Database & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS) policies.
- **File Storage**: Supabase Private Storage with SHA-256 integrity verification and short-lived signed download authorization URLs.
- **SDK**: Official Python package `sxrvesh_runner` for runtime license verification, device locking, and periodic authoritative heartbeats.

---

## 📐 3. Execution Models

| Execution Model | Description | Pros | Cons / Mitigations |
| :--- | :--- | :--- | :--- |
| **Model A: Local Native** | Runs on local device (Windows/Android) | Zero server compute cost, full hardware access | Python source code inspectable by determined users |
| **Model B: Server Sandbox** | Runs in isolated server container (microVM) | Complete code confidentiality | Cloudflare Workers cannot run unrestricted Python; high server compute cost |
| **Model C: Hybrid (Default)** | Native local execution guarded by platform license checks, short-lived tokens & heartbeats | Optimal balance: zero server execution cost with real-time revocation and device locking | Python SDK `sxrvesh_runner` terminates script if license expired or second device detected |

---

## 📦 4. Official Python SDK: `sxrvesh_runner`

Sellers protect their Python scripts by importing the official client:

```python
"""
Example Seller Script: market_analyzer.py
"""
import sys
from sxrvesh_runner import RunnerClient, RunnerLicenseError

def main():
    # Initialize client with registered Script ID
    client = RunnerClient(
        script_id="scr_market_analyzer_982",
        auto_heartbeat=True,
        heartbeat_interval=300  # authoritatively checked every 5 mins
    )

    # Validate license against the platform
    license_info = client.check_license()
    if not license_info.allowed:
        print(f"[ACCESS DENIED] {license_info.reason}", file=sys.stderr)
        sys.exit(1)

    print(f"[AUTHORIZED] Running for Customer: {license_info.customer_id}")
    print(f"[EXPIRATION] License valid until: {license_info.expires_at}")

    # Protected Seller logic starts here
    print("[RUNNER] Workload executing...")

if __name__ == "__main__":
    main()
```

---

## 🚀 5. Local Setup & Installation

### Prerequisites:
- Node.js 18+ & npm
- A free [Supabase](https://supabase.com) project
- Cloudflare Wrangler CLI (optional for production deployment)

### Steps:
1. **Clone the repository and install dependencies**:
   ```bash
   git clone <repo-url>
   cd sxrveshlabs-runner
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase project credentials:
   ```env
   # Client-safe Supabase credentials
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"

   # Server-side only (Cloudflare Workers API)
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   RUNNER_SIGNING_SECRET="a-cryptographically-secure-random-string-min-32-chars"
   APP_URL="http://localhost:3000"
   ```

3. **Supabase Auth Setup (Disable Public Self-Signup)**:
   - In Supabase Dashboard → **Authentication** → **Providers** → **Email**:
     - Turn **OFF** "Allow new users to sign up" (ensures only Admin and Sellers can create accounts via privileged backend routes).

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Deploy to Cloudflare Pages**:
   ```bash
   npx wrangler pages deploy dist --project-name sxrveshlabs-runner
   ```

---

## 🗄️ 6. Core Database Schema Overview

All database tables in Supabase use **Row Level Security (RLS)**:

- `profiles`: User account record linked to `auth.users(id)` with roles (`admin`, `seller`, `customer`) and `status`.
- `sellers`: Tenant entity owned by a profile (`owner_id`), strictly isolated from other sellers.
- `scripts`: Registered Python scripts (`id`, `seller_id`, `file_hash`, `execution_mode`, `current_version`).
- `script_versions`: Version history and changelog for each script.
- `customers`: Customer accounts created by a specific Seller.
- `purchases`: Record of script licenses issued/purchased.
- `licenses`: Start date, expiration date, device limit, and status (`active`, `expired`, `suspended`, `revoked`).
- `device_sessions`: Tracks registered hardware session to enforce the **1-active-device** policy.
- `execution_sessions`: Log of runs, status (`running`, `completed`, `failed`), and exit codes.
- `audit_logs`: Immutable audit trail of administrative, seller, and security events.

---

## 📋 7. Phase Roadmap

- **Phase 1: Foundation** (✅ Complete) — Project shell, Cloudflare config, Supabase connector, type definitions, closed-provisioning architecture, SDK contract simulator.
- **Phase 2: Authentication** (⏳ Next) — Supabase Auth session handling, Admin/Seller closed account provisioning, role-gated navigation.
- **Phase 3: Database & Permissions** — PostgreSQL schema migrations and RLS policies for strict multi-seller isolation.
- **Phase 4: Admin Panel** — Seller account creation, suspension, platform-wide telemetry, and audit logs.
- **Phase 5: Seller Panel** — Script uploads, versioning, customer account provisioning, license assignment.
- **Phase 6: Customer Panel** — Licensed scripts library, device session management, runner launch.
- **Phase 7: Binding SDK** — Complete Python `sxrvesh_runner` package and REST licensing endpoints.
- **Phase 8: Runner Engine** — Local & Android hybrid execution runners.
- **Phase 9: Security & Production** — Hardening, checksum verification, rate-limiting.
- **Phase 10: Future Features** — Automated payments, renewals, subscriptions, and commission tracking.

---

## 📄 License
Proprietary — Built by SxrveshLabs. All rights reserved.
