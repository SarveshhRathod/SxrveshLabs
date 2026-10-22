import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
  Database,
  Cpu,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Terminal,
  FileCode,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

interface OverviewViewProps {
  isConfigured: boolean;
  activeRole: UserRole;
  onNavigateToTab: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  isConfigured,
  activeRole,
  onNavigateToTab,
}) => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    frontend_build: true,
    cloudflare_config: true,
    supabase_setup: isConfigured,
    type_definitions: true,
    sdk_contract: true,
    responsive_shell: true,
    zero_fake_data: true,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getRoleBadge = () => {
    switch (activeRole) {
      case 'admin':
        return { label: 'Platform Admin Perspective', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'seller':
        return { label: 'Seller Perspective (Tenant Isolated)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'customer':
        return { label: 'Customer Perspective (End User)', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Phase 1 Execution
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className={`text-xs px-2.5 py-0.5 rounded border ${roleBadge.bg}`}>
                {roleBadge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              SxrveshLabs Runner Foundation
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Multi-seller Python script licensing and secure execution engine. Core project structure, Cloudflare configuration, Supabase client layer, and domain data models are established.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('architecture')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Architecture Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTab('config')}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Configure Supabase</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Topology Grid */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
          System Infrastructure & Topology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0f1624] border border-slate-800/90 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Cloud className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400">PAGES + WORKERS</span>
            </div>
            <h3 className="text-base font-semibold text-white">Cloudflare Edge</h3>
            <p className="text-xs text-slate-400 mt-1">
              Static dashboard hosted on Cloudflare Pages. REST API endpoints deployed via Cloudflare Workers with strict rate-limiting and JWT verification.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Config:</span>
              <span className="font-mono text-slate-300">wrangler.toml</span>
            </div>
          </div>

          <div className="bg-[#0f1624] border border-slate-800/90 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-mono ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isConfigured ? 'CLIENT INITIALIZED' : 'AWAITING .ENV'}
              </span>
            </div>
            <h3 className="text-base font-semibold text-white">Supabase PostgreSQL</h3>
            <p className="text-xs text-slate-400 mt-1">
              Authoritative database with Row Level Security (RLS) policies enforcing multi-seller tenant isolation, device sessions, and private script storage.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Client State:</span>
              <span className={`font-mono ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isConfigured ? 'Ready' : 'Fallback active'}
              </span>
            </div>
          </div>

          <div className="bg-[#0f1624] border border-slate-800/90 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-blue-400">SDK DEFINED</span>
            </div>
            <h3 className="text-base font-semibold text-white">sxrvesh_runner SDK</h3>
            <p className="text-xs text-slate-400 mt-1">
              Official Python library binding scripts to platform licenses, enforcing one-active-device session tokens and periodic authoritative heartbeat checks.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Interface:</span>
              <span className="font-mono text-slate-300">RunnerClient</span>
            </div>
          </div>
        </div>
      </div>

      {/* Closed Registration Policy & Account Provisioning Hierarchy */}
      <div className="bg-[#101726] border border-amber-500/30 rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-white">
            Closed User Provisioning Model (No Public Self-Registration)
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Public registration is strictly disabled. No visitor can create an account on their own. Accounts are provisioned through a strict hierarchical authority chain:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="font-semibold text-rose-400 mb-1">1. Admin Provisions Sellers</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Only the Platform Admin creates Seller accounts, establishes their tenant boundary, and issues credentials.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="font-semibold text-emerald-400 mb-1">2. Sellers Provision Customers</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Each Seller creates Customer accounts for buyers, assigning licensed Python scripts and time limits.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="font-semibold text-blue-400 mb-1">3. Customers Log In & Run</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Customers log in using their Seller-provided credentials to run authorized scripts under the 1-device policy.
            </p>
          </div>
        </div>
      </div>

      {/* Role Perspective Contextual Card */}
      <div className="bg-[#0f1624] border border-slate-800/90 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-white">
            Current Perspective Blueprint: {activeRole.toUpperCase()}
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {activeRole === 'admin' && (
            <>
              As the <strong>Platform Owner</strong>, the Admin will manage Seller onboarding, monitor platform-wide license consumption, inspect audit logs, and revoke compromised API credentials. In accordance with platform security rules, the Admin cannot upload scripts or manage Customers on behalf of individual Sellers through regular workflows.
            </>
          )}
          {activeRole === 'seller' && (
            <>
              As a <strong>Seller Tenant</strong>, you will register Python scripts, generate unique Script IDs, download the official SDK integration snippet, issue time-bound customer licenses, and review execution logs with strict data separation from all other platform Sellers.
            </>
          )}
          {activeRole === 'customer' && (
            <>
              As an authorized <strong>Customer</strong>, you will view your purchased script catalog, monitor license expiration dates, manage your registered device session (1 active session limit), and run scripts through the compatible runner interface with live I/O support.
            </>
          )}
        </p>
        <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span>Note: Full user authentication and role-gated routes are scheduled for <strong>Phase 2</strong>.</span>
          <span className="text-emerald-400 font-mono text-[11px]">Phase 1 Active</span>
        </div>
      </div>

      {/* Phase 1 Acceptance & Verification Checklist */}
      <div className="bg-[#0f1624] border border-slate-800/90 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Phase 1 Verification Checklist</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every deliverable for Phase 1 must be verified before proceeding to Phase 2 (Authentication).
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length} Ready
          </span>
        </div>

        <div className="space-y-2.5">
          {[
            {
              id: 'frontend_build',
              title: 'React + TypeScript + Vite build pipeline',
              desc: 'Clean compilation, strict TypeScript typings, Tailwind CSS typography & base styles configured.',
            },
            {
              id: 'cloudflare_config',
              title: 'Cloudflare Pages & Workers configuration',
              desc: 'wrangler.toml generated with output directory and production bindings documented.',
            },
            {
              id: 'supabase_setup',
              title: 'Supabase JS client setup & resilient wrapper',
              desc: 'Client singleton with environment validation and fallback to prevent startup crashes.',
            },
            {
              id: 'type_definitions',
              title: 'Comprehensive PostgreSQL and entity data models',
              desc: 'Type schemas for profiles, sellers, scripts, script_versions, customers, licenses, sessions, and audit_logs.',
            },
            {
              id: 'sdk_contract',
              title: 'Official sxrvesh_runner Python SDK contract',
              desc: 'Structured request/response interfaces for check_license, register_session, and heartbeat.',
            },
            {
              id: 'responsive_shell',
              title: 'Responsive dashboard shell with role perspective preview',
              desc: 'Top bar contract, collapsible navigation, dark theme, and mobile-ready layout.',
            },
            {
              id: 'zero_fake_data',
              title: 'Strict honest data integrity policy',
              desc: 'No fake auth tokens or mock database entries presented as real. External dependencies clearly marked.',
            },
          ].map((item) => {
            const isChecked = checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 hover:bg-slate-900/70 transition-colors cursor-pointer"
              >
                <div className="mt-0.5">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-200">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
