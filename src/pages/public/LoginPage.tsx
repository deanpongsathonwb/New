import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { User, UserRole } from '../../types/common.types.ts';
import imagesSeed from '../../seed/images.json';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const users = useAppStore((state) => state.users);
  const systemOwner = useAppStore((state) => state.settings.systemOwner);

  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id ?? '');

  const handleSelectUser = (user: User) => {
    setSelectedUserId(user.id);
  };

  const getRoleLandingRoute = (role: UserRole): string => {
    switch (role) {
      case 'accountant':
        return ROUTES.ACCOUNTANT.DASHBOARD;
      case 'finance':
        return ROUTES.FINANCE.DASHBOARD;
      case 'auditor':
        return ROUTES.AUDITOR.DASHBOARD;
      case 'admin':
        return ROUTES.ADMIN.DASHBOARD;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = users.find((u) => u.id === selectedUserId);
    if (targetUser) {
      login(targetUser);
      navigate(getRoleLandingRoute(targetUser.role));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-6 select-none">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-slate-950 p-8 text-center border-b border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {UI.system.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {systemOwner}
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-slate-800">
              {UI.auth.loginTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {UI.auth.loginSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 tracking-wider">
              {UI.auth.selectAccount}
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {users.map((user) => {
                const isSelected = user.id === selectedUserId;
                const avatar =
                  imagesSeed.avatars[user.avatarKey as keyof typeof imagesSeed.avatars] ||
                  imagesSeed.avatars.default;

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={user.fullName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {user.fullName}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {UI.roles[user.role].title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {UI.roles[user.role].responsibility}
                      </p>
                    </div>
                    <div className="shrink-0 text-slate-400">
                      {isSelected ? (
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>{UI.auth.loginButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{UI.admin.healthy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
