import React, { useState } from 'react';
import {
  Settings,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Database,
  Cloud,
  FileText,
  Key,
} from 'lucide-react';
import { getSupabaseConfigStatus } from '../../lib/supabase';

export const ConfigurationView: React.FC = () => {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const status = getSupabaseConfigStatus();

  const envTemplate = `# SxrveshLabs Runner — .env.local
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"

# Server-side (Cloudflare Workers / Backend only)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
RUNNER_SIGNING_SECRET="secure-random-hmac-secret-at-least-32-chars"
APP_URL="http://localhost:3000"
`;

  const phase3SqlPreview = `-- SxrveshLabs Runner — PostgreSQL Core Schema (Preview for Phase 3)
-- 1. Profiles (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'seller', 'customer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Sellers Table (Tenant Isolation)
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY DEFAULT ('sel_' || gen_random_uuid()),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  seller_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Scripts Table
CREATE TABLE IF NOT EXISTS public.scripts (
  id TEXT PRIMARY KEY DEFAULT ('scr_' || gen_random_uuid()),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  current_version TEXT NOT NULL DEFAULT '1.0.0',
  storage_path TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  execution_mode TEXT NOT NULL DEFAULT 'hybrid' CHECK (execution_mode IN ('local', 'server', 'hybrid')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) is enabled for all tables in Phase 3.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const copySql = () => {
    navigator.clipboard.writeText(phase3SqlPreview);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          Diagnostics & Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Environment & Service Setup
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl">
          Connect your Supabase PostgreSQL instance and configure Cloudflare deployment settings to prepare for Phase 2 Authentication and Phase 3 Database migrations.
        </p>
      </div>

      {/* Diagnostics Panel */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">
          Runtime Environment Diagnostic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">VITE_SUPABASE_URL</span>
              {status.hasUrl ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="font-mono text-xs text-slate-400 truncate">
              {status.hasUrl ? status.urlPreview : 'Not set / Placeholder'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {status.hasUrl ? 'Valid URL detected' : 'Add to .env.local'}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">VITE_SUPABASE_ANON_KEY</span>
              {status.hasAnonKey ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="font-mono text-xs text-slate-400 truncate">
              {status.hasAnonKey ? '••••••••••••••••••••••••' : 'Not configured'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {status.hasAnonKey ? 'Anon public key detected' : 'Add to .env.local'}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">Cloudflare Build Target</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-xs text-emerald-400 truncate">
              ./dist (wrangler.toml)
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Pages & Workers ready
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Setup Guide */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-3">
          Step-by-Step External Configuration Guide
        </h2>
        <div className="space-y-4 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-mono flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <div className="font-semibold text-white">Create a Supabase Project</div>
              <p className="text-slate-400 mt-0.5">
                Visit <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a>, create a free project named <code className="text-slate-200">sxrveshlabs-runner</code>, and navigate to Project Settings → API to locate your Project URL and Anon Public Key.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-mono flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <div className="font-semibold text-white">Populate Environment Variables</div>
              <p className="text-slate-400 mt-0.5">
                Create a <code className="text-slate-200">.env.local</code> file in your project root using the template below. The application's Supabase client will automatically detect your project without restarting.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-mono flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <div className="font-semibold text-white">Disable Public Signups (Closed Account Policy)</div>
              <p className="text-slate-400 mt-0.5">
                In Supabase Dashboard → <strong>Authentication</strong> → <strong>Providers</strong> → <strong>Email</strong>: Turn <strong>OFF</strong> "Allow new users to sign up". This ensures no random user can create an account autonomously.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-mono flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <div className="font-semibold text-white">Provisioning Chain (Admin → Seller → Customer)</div>
              <p className="text-slate-400 mt-0.5">
                The Platform Admin manually bootstraps or invites Sellers via privileged service API. Sellers then log in to their dashboard and provision Customer accounts for buyers, binding their purchased Python scripts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyable Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* .env Template */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d131f] border-b border-slate-800">
            <span className="text-xs font-mono text-slate-300">.env.local template</span>
            <button
              onClick={copyEnv}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 bg-[#090d16] font-mono text-xs overflow-x-auto text-slate-300 flex-1">
            <pre className="whitespace-pre leading-relaxed">{envTemplate}</pre>
          </div>
        </div>

        {/* Phase 3 SQL Schema Preview */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d131f] border-b border-slate-800">
            <span className="text-xs font-mono text-slate-300">Phase 3 SQL Migration Preview</span>
            <button
              onClick={copySql}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 bg-[#090d16] font-mono text-xs overflow-x-auto text-slate-300 flex-1 max-h-72">
            <pre className="whitespace-pre leading-relaxed">{phase3SqlPreview}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
