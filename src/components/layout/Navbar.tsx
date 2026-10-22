import React from 'react';
import { Terminal, Shield, BookOpen, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, isConfigured }) => {
  const navItems = [
    { id: 'overview', label: 'Foundation' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'sdk', label: 'Python SDK' },
    { id: 'config', label: 'Environment' },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0d131f]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Terminal className="w-4 h-4" />
        </div>
        <button
          onClick={() => onSelectTab('overview')}
          className="text-left font-bold tracking-tight text-white hover:text-slate-200 transition-colors whitespace-nowrap text-base"
        >
          SxrveshLabs Runner
        </button>
      </div>

      {/* Zone 2: Navigation Links (Clean single-line text links with subtle hover/active state) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`whitespace-nowrap transition-colors pb-1 text-sm ${
              currentTab === item.id
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Primary Action / Status Indicator */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-md border border-slate-800">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Supabase:</span>
          <span className={`font-medium ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isConfigured ? 'Connected' : 'Pending .env'}
          </span>
        </div>
        <button
          onClick={() => onSelectTab('config')}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 rounded-md hover:bg-emerald-300 transition-colors whitespace-nowrap"
        >
          Setup Guide
        </button>
      </div>
    </header>
  );
};
