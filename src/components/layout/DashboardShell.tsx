import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { OverviewView } from '../views/OverviewView';
import { ArchitectureView } from '../views/ArchitectureView';
import { SdkPreviewView } from '../views/SdkPreviewView';
import { ConfigurationView } from '../views/ConfigurationView';
import { isSupabaseConfigured } from '../../lib/supabase';
import { UserRole } from '../../types';
import { Menu, X } from 'lucide-react';

export const DashboardShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [activeRole, setActiveRole] = useState<UserRole>('seller');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewView
            isConfigured={isSupabaseConfigured}
            activeRole={activeRole}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        );
      case 'architecture':
        return <ArchitectureView />;
      case 'sdk':
        return <SdkPreviewView />;
      case 'config':
        return <ConfigurationView />;
      default:
        return (
          <OverviewView
            isConfigured={isSupabaseConfigured}
            activeRole={activeRole}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Contract Compliant Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setMobileMenuOpen(false);
        }}
        isConfigured={isSupabaseConfigured}
      />

      {/* Mobile Menu Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <span className="text-slate-400">
          Tab: <strong className="text-emerald-400 capitalize">{currentTab}</strong>
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileMenuOpen ? 'Close Menu' : 'Workspace Menu'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            activeRole={activeRole}
            onChangeRole={setActiveRole}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
            <div className="w-72 bg-[#0b101a] h-full shadow-2xl flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-sm text-white">SxrveshLabs Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  currentTab={currentTab}
                  onSelectTab={(tab) => {
                    setCurrentTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  activeRole={activeRole}
                  onChangeRole={(role) => {
                    setActiveRole(role);
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
