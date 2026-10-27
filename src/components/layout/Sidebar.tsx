import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileSpreadsheet,
  Scale,
  PieChart,
  Receipt,
  FileCheck2,
  Building2,
  CheckCircle,
  Activity,
  ShieldCheck,
  FileText,
  Users,
  Settings,
  HardDrive,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useAppStore } from '../../stores/app.store.ts';
import imagesSeed from '../../seed/images.json';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const systemOwner = useAppStore((state) => state.settings.systemOwner);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  if (!currentUser) return null;

  const role = currentUser.role;

  const getNavItems = () => {
    switch (role) {
      case 'accountant':
        return [
          {
            path: ROUTES.ACCOUNTANT.DASHBOARD,
            label: UI.navigation.accountant.dashboard,
            icon: <LayoutDashboard className="w-5 h-5" />
          },
          {
            path: ROUTES.ACCOUNTANT.CHART_OF_ACCOUNTS,
            label: UI.navigation.accountant.chartOfAccounts,
            icon: <BookOpen className="w-5 h-5" />
          },
          {
            path: ROUTES.ACCOUNTANT.GENERAL_JOURNAL,
            label: UI.navigation.accountant.generalJournal,
            icon: <FileSpreadsheet className="w-5 h-5" />
          },
          {
            path: ROUTES.ACCOUNTANT.TRIAL_BALANCE,
            label: UI.navigation.accountant.trialBalance,
            icon: <Scale className="w-5 h-5" />
          },
          {
            path: ROUTES.ACCOUNTANT.FINANCIAL_STATEMENTS,
            label: UI.navigation.accountant.financialStatements,
            icon: <PieChart className="w-5 h-5" />
          }
        ];
      case 'finance':
        return [
          {
            path: ROUTES.FINANCE.DASHBOARD,
            label: UI.navigation.finance.dashboard,
            icon: <LayoutDashboard className="w-5 h-5" />
          },
          {
            path: ROUTES.FINANCE.INVOICES,
            label: UI.navigation.finance.invoices,
            icon: <Receipt className="w-5 h-5" />
          },
          {
            path: ROUTES.FINANCE.BILLS,
            label: UI.navigation.finance.bills,
            icon: <FileCheck2 className="w-5 h-5" />
          },
          {
            path: ROUTES.FINANCE.BANK_ACCOUNTS,
            label: UI.navigation.finance.bankAccounts,
            icon: <Building2 className="w-5 h-5" />
          },
          {
            path: ROUTES.FINANCE.RECONCILIATION,
            label: UI.navigation.finance.reconciliation,
            icon: <CheckCircle className="w-5 h-5" />
          }
        ];
      case 'auditor':
        return [
          {
            path: ROUTES.AUDITOR.DASHBOARD,
            label: UI.navigation.auditor.dashboard,
            icon: <LayoutDashboard className="w-5 h-5" />
          },
          {
            path: ROUTES.AUDITOR.FINANCIAL_RATIOS,
            label: UI.navigation.auditor.financialRatios,
            icon: <Activity className="w-5 h-5" />
          },
          {
            path: ROUTES.AUDITOR.AUDIT_TRAIL,
            label: UI.navigation.auditor.auditTrail,
            icon: <FileText className="w-5 h-5" />
          },
          {
            path: ROUTES.AUDITOR.COMPLIANCE,
            label: UI.navigation.auditor.compliance,
            icon: <ShieldCheck className="w-5 h-5" />
          }
        ];
      case 'admin':
        return [
          {
            path: ROUTES.ADMIN.DASHBOARD,
            label: UI.navigation.admin.dashboard,
            icon: <LayoutDashboard className="w-5 h-5" />
          },
          {
            path: ROUTES.ADMIN.USER_MANAGEMENT,
            label: UI.navigation.admin.userManagement,
            icon: <Users className="w-5 h-5" />
          },
          {
            path: ROUTES.ADMIN.SETTINGS,
            label: UI.navigation.admin.settings,
            icon: <Settings className="w-5 h-5" />
          },
          {
            path: ROUTES.ADMIN.SYSTEM_HEALTH,
            label: UI.navigation.admin.systemHealth,
            icon: <HardDrive className="w-5 h-5" />
          }
        ];
    }
  };

  const navItems = getNavItems();
  const avatarUrl =
    imagesSeed.avatars[currentUser.avatarKey as keyof typeof imagesSeed.avatars] ||
    imagesSeed.avatars.default;

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand & Organization Title */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight truncate">
              {UI.system.name}
            </h1>
            <p className="text-xs text-slate-400 font-medium truncate mt-0.5" title={systemOwner}>
              {systemOwner}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 tracking-wider">
          {UI.roles[role].title}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom-left Sidebar Footer: Sole profile and logout interaction point */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/60 mb-2">
          <img
            src={avatarUrl}
            alt={currentUser.fullName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{currentUser.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{UI.roles[role].title}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-600/20 rounded-lg transition-colors border border-rose-900/30"
        >
          <LogOut className="w-4 h-4" />
          <span>{UI.auth.logoutButton}</span>
        </button>
      </div>
    </aside>
  );
};
