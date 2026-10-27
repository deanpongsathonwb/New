import React from 'react';
import { Calendar, Shield } from 'lucide-react';
import { UI } from '../../constants/index.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useAppStore } from '../../stores/app.store.ts';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const fiscalYear = useAppStore((state) => state.settings.fiscalYear);

  if (!currentUser) return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-slate-800 leading-tight truncate">
          {title || UI.system.name}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-500 font-normal truncate mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Fiscal Year Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{UI.settingsFields.fiscalYear}: {fiscalYear}</span>
        </div>

        {/* Certified Role Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold border border-blue-200">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{UI.roles[currentUser.role].title}</span>
        </div>
      </div>
    </header>
  );
};
