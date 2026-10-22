import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Code2,
  Settings,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Circle,
  HelpCircle,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onChangeRole,
}) => {
  const mainNav = [
    { id: 'overview', label: 'Phase 1 Foundation', icon: LayoutDashboard },
    { id: 'architecture', label: 'System Architecture', icon: Layers },
    { id: 'sdk', label: 'Python SDK Contract', icon: Code2 },
    { id: 'config', label: 'Diagnostics & .env', icon: Settings },
  ];

  const rolePreviews = [
    { role: 'admin' as UserRole, label: 'Admin Perspective', icon: ShieldCheck, desc: 'Platform Owner' },
    { role: 'seller' as UserRole, label: 'Seller Perspective', icon: Building2, desc: 'Script Publisher' },
    { role: 'customer' as UserRole, label: 'Customer Perspective', icon: Users, desc: 'End User / Runner' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0b101a] border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Core Navigation */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-2">
            Foundation Workspace
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Multi-Role Perspective Preview */}
        <div>
          <div className="flex items-center justify-between px-2.5 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Role Layout Preview
            </span>
          </div>
          <div className="space-y-1">
            {rolePreviews.map((rp) => {
              const Icon = rp.icon;
              const isSelected = activeRole === rp.role;
              return (
                <button
                  key={rp.role}
                  onClick={() => onChangeRole(rp.role)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-colors border ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/40 text-slate-200'
                      : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-medium leading-none">{rp.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{rp.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase Roadmap Status */}
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Execution Roadmap
          </div>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phase 1: Foundation</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Circle className="w-3.5 h-3.5 text-slate-400" />
              <span>Phase 2: Authentication</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Circle className="w-3.5 h-3.5 text-slate-400" />
              <span>Phase 3: DB & RLS</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Circle className="w-3.5 h-3.5 text-slate-400" />
              <span>Phase 4-6: Dashboards</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Circle className="w-3.5 h-3.5 text-slate-400" />
              <span>Phase 7-8: SDK & Runner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>SxrveshLabs Core v0.1</span>
        <span className="font-mono text-emerald-400">Phase 1 Active</span>
      </div>
    </aside>
  );
};
