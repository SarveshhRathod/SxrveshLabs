import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import { SdkLicenseCheckRequest, SdkLicenseCheckResponse } from '../../types';

export const SdkPreviewView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [simulatedScriptId, setSimulatedScriptId] = useState('scr_market_analyzer');
  const [simulatedDevice, setSimulatedDevice] = useState('win32_hwid_982b1c4a');
  const [simulatedToken, setSimulatedToken] = useState('cst_tok_valid_test_session');
  const [simulationResult, setSimulationResult] = useState<SdkLicenseCheckResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const pythonSnippet = `"""
SxrveshLabs Runner — Official Python SDK Integration Example
Package: sxrvesh_runner
Version: 0.1.0
"""

import sys
from sxrvesh_runner import RunnerClient, RunnerLicenseError

def main():
    # 1. Initialize Runner Client with the Seller's registered Script ID
    client = RunnerClient(
        script_id="${simulatedScriptId}",
        auto_heartbeat=True,
        heartbeat_interval=300  # authoritatively revalidated every 5 mins
    )

    # 2. Authoritative License Check
    try:
        print("[SxrveshLabs Runner] Verifying license with platform authority...")
        license_info = client.check_license()
        
        if not license_info.allowed:
            print(f"[ACCESS DENIED] {license_info.reason}", file=sys.stderr)
            sys.exit(1)

        print(f"[ACCESS GRANTED] License: {license_info.license_id}")
        print(f"[STATUS] Valid until: {license_info.expires_at}")
        
    except RunnerLicenseError as err:
        print(f"[FATAL] License verification error: {err}", file=sys.stderr)
        sys.exit(1)

    # 3. Seller's Protected Application Logic Begins Here
    print("[RUNNING] Executing Python workload...")
    # Your script logic here...

if __name__ == "__main__":
    main()
`;

  const copyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Simulate authoritative contract validation logic for demonstration
      if (!simulatedScriptId) {
        setSimulationResult({
          allowed: false,
          status: 'revoked',
          reason: 'Missing script_id identifier.',
        });
      } else if (simulatedToken.includes('expired')) {
        setSimulationResult({
          allowed: false,
          status: 'expired',
          expires_at: '2026-10-01T00:00:00Z',
          reason: 'Customer license expired on October 1, 2026. Renewal required.',
        });
      } else if (simulatedToken.includes('invalid') || simulatedToken.includes('revoked')) {
        setSimulationResult({
          allowed: false,
          status: 'revoked',
          reason: 'Active session revoked. Another device registered for this customer account.',
        });
      } else {
        setSimulationResult({
          allowed: true,
          license_id: 'lic_8820f1_active',
          customer_id: 'cst_usr_9941',
          status: 'active',
          expires_at: '2026-12-31T23:59:59Z',
          heartbeat_interval_seconds: 300,
          reason: 'Valid active license with 1-active-device policy satisfied.',
        });
      }
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          Binding SDK Contract
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          sxrvesh_runner Python Package
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl">
          Sellers bind their Python scripts using the lightweight official SDK. The client enforces short-lived execution tokens, validates device identity, and establishes a periodic heartbeat with the platform API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Snippet Box */}
        <div className="lg:col-span-7 bg-[#101726] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d131f] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300">script_binding_example.py</span>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SDK Code'}</span>
            </button>
          </div>
          <div className="p-4 bg-[#090d16] font-mono text-xs overflow-x-auto text-slate-300 flex-1">
            <pre className="leading-relaxed whitespace-pre">{pythonSnippet}</pre>
          </div>
        </div>

        {/* Interactive Contract Simulator */}
        <div className="lg:col-span-5 bg-[#101726] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">SDK API Contract Simulator</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Simulate how the platform backend validates <code className="text-slate-300">POST /api/sdk/check-license</code> payloads based on Script ID and device tokens.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Registered Script ID
                </label>
                <input
                  type="text"
                  value={simulatedScriptId}
                  onChange={(e) => setSimulatedScriptId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Customer Session Token
                </label>
                <select
                  value={simulatedToken}
                  onChange={(e) => setSimulatedToken(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="cst_tok_valid_test_session">Valid Active Token (Single Device)</option>
                  <option value="cst_tok_expired_2026">Expired License Token</option>
                  <option value="cst_tok_revoked_conflict">Revoked Token (Concurrent Device Detected)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Device Hardware Identifier
                </label>
                <input
                  type="text"
                  value={simulatedDevice}
                  onChange={(e) => setSimulatedDevice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full mt-2 py-2 px-3 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSimulating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Simulate License Check</span>
              </button>
            </div>
          </div>

          {/* Simulator Output */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Authoritative API Response:
            </div>
            {simulationResult ? (
              <div
                className={`p-3 rounded-lg border text-xs font-mono ${
                  simulationResult.allowed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{simulationResult.allowed ? '200 OK' : '403 FORBIDDEN'}</span>
                  <span>allowed: {String(simulationResult.allowed)}</span>
                </div>
                <div className="text-[11px] opacity-90">{simulationResult.reason}</div>
                {simulationResult.expires_at && (
                  <div className="text-[10px] opacity-75 mt-1">
                    expires_at: {simulationResult.expires_at}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono text-center">
                Click "Simulate License Check" to inspect the API response.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
