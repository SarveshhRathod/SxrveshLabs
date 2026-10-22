import React from 'react';
import {
  ShieldAlert,
  Server,
  Smartphone,
  Monitor,
  Key,
  Layers,
  Database,
  Lock,
  GitBranch,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          System Architecture & Evaluation
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Multi-Seller Security & Execution Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl">
          Detailed technical specifications for tenant isolation, PostgreSQL Row Level Security (RLS), cryptographic script binding, and the execution engine evaluation.
        </p>
      </div>

      {/* Execution Model Comparison */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Execution Model Evaluation (Models A, B, C)</h2>
            <p className="text-xs text-slate-400">Trade-off analysis mandated by Platform Architecture Spec</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Model A */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Model A: Local Runner</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Native</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The script is downloaded to the authorized user's device (Windows Desktop or Android terminal/PWA runner) and executed directly using the device's native Python runtime.
              </p>
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                <div className="text-emerald-400 font-medium">Advantages:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                  <li>Zero server compute costs.</li>
                  <li>Full support for hardware/USB/GUI scripts.</li>
                  <li>Works with any local Python packages.</li>
                </ul>
                <div className="text-amber-400 font-medium pt-1">Limitations:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                  <li>Client source code inspectable by determined users.</li>
                  <li>Requires local Python installation or bundled runtime.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Model B */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Model B: Server Sandbox</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">Isolated</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The script never leaves the server. It runs inside an isolated container/microVM sandbox (e.g. gVisor, Firecracker, or WebAssembly WASI) with CPU/memory limits.
              </p>
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                <div className="text-emerald-400 font-medium">Advantages:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                  <li>Complete source code confidentiality.</li>
                  <li>No client-side dependencies needed.</li>
                  <li>Server controls all input/output streams.</li>
                </ul>
                <div className="text-amber-400 font-medium pt-1">Limitations:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                  <li>Higher infrastructure compute & memory cost.</li>
                  <li>Cloudflare Workers cannot run unrestricted Python.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Model C */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">Model C: Hybrid (Recommended)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Optimal</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Local execution paired with server-authoritative license validation, short-lived session tokens, and the official <code className="text-emerald-300">sxrvesh_runner</code> SDK heartbeat check.
              </p>
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                <div className="text-emerald-400 font-medium">Recommended Implementation:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                  <li>Client SDK contacts platform API on launch.</li>
                  <li>Token expires every 5-15 min without heartbeat.</li>
                  <li>Immediate revocation if second device launches.</li>
                  <li>Bytecode compilation (.pyc) + HMAC signature.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema & RLS Architecture */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">PostgreSQL Multi-Tenant RLS Model</h2>
            <p className="text-xs text-slate-400">Row Level Security rules scheduled for Phase 3</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Table</th>
                <th className="py-2.5 px-3">Tenant Primary Key</th>
                <th className="py-2.5 px-3">RLS Policy Principle</th>
                <th className="py-2.5 px-3">Admin Boundary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-mono text-emerald-400">profiles</td>
                <td className="py-2.5 px-3 font-mono">id (auth.uid())</td>
                <td className="py-2.5 px-3">Users can only select and update their own profile row.</td>
                <td className="py-2.5 px-3 text-slate-400">View all, mutate status.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono text-emerald-400">sellers</td>
                <td className="py-2.5 px-3 font-mono">owner_id</td>
                <td className="py-2.5 px-3">Sellers can only access rows where owner_id = auth.uid().</td>
                <td className="py-2.5 px-3 text-slate-400">Create & suspend sellers.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono text-emerald-400">scripts</td>
                <td className="py-2.5 px-3 font-mono">seller_id</td>
                <td className="py-2.5 px-3">Strict isolation: Sellers only see scripts matching their seller_id.</td>
                <td className="py-2.5 px-3 text-slate-400">View metadata only (no upload).</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono text-emerald-400">licenses</td>
                <td className="py-2.5 px-3 font-mono">customer_id & script_id</td>
                <td className="py-2.5 px-3">Customer sees own licenses. Seller sees licenses for their scripts.</td>
                <td className="py-2.5 px-3 text-slate-400">Read-only audit access.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono text-emerald-400">device_sessions</td>
                <td className="py-2.5 px-3 font-mono">customer_id</td>
                <td className="py-2.5 px-3">Enforces 1 active device session. Older sessions auto-expire.</td>
                <td className="py-2.5 px-3 text-slate-400">Emergency revoke capability.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Principles Callout */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-white">Binding Security & Anti-Tamper Truths</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          In Python distribution, client-side code delivered in plain text can be inspected or modified by determined local users. SxrveshLabs Runner protects Sellers by using <strong>short-lived server-signed session tokens</strong>, <strong>authoritative server clocks</strong>, <strong>remote API capability gating</strong>, and <strong>SHA-256 file integrity checks</strong> rather than attempting impossible permanent client obfuscation.
        </p>
      </div>
    </div>
  );
};
