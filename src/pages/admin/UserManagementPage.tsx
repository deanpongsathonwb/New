import React, { useState } from 'react';
import { Plus, Users, UserCheck } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { User, UserRole } from '../../types/common.types.ts';
import imagesSeed from '../../seed/images.json';

export const UserManagementPage: React.FC = () => {
  const users = useAppStore((state) => state.users);
  const addUser = useAppStore((state) => state.addUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('accountant');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      username,
      fullName,
      email,
      role,
      avatarKey: 'default',
      status: 'active',
      lastLogin: UI.common.emptyValue
    };

    addUser(newUser);
    setIsModalOpen(false);
    setFullName('');
    setUsername('');
    setEmail('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.admin.usersTitle}
        subtitle={UI.admin.usersSubtitle}
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {UI.admin.usersTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {UI.admin.usersSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.admin.newUser}</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{UI.admin.fullName}</th>
                <th className="py-3 px-4">{UI.auth.usernameLabel}</th>
                <th className="py-3 px-4">{UI.admin.email}</th>
                <th className="py-3 px-4">{UI.admin.role}</th>
                <th className="py-3 px-4">{UI.admin.lastLogin}</th>
                <th className="py-3 px-4 text-center">{UI.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const avatar =
                  imagesSeed.avatars[u.avatarKey as keyof typeof imagesSeed.avatars] ||
                  imagesSeed.avatars.default;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatar}
                          alt={u.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="font-semibold text-slate-900">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{u.username}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {UI.roles[u.role].title}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">{u.lastLogin}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {UI.common.active}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">
                  {UI.admin.newUser}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                {UI.common.close}
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.admin.fullName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={UI.admin.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.auth.usernameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={UI.auth.usernameLabel}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.admin.email}
                </label>
                <input
                  type="email"
                  required
                  placeholder={UI.admin.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.admin.role}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="accountant">{UI.roles.accountant.title}</option>
                  <option value="finance">{UI.roles.finance.title}</option>
                  <option value="auditor">{UI.roles.auditor.title}</option>
                  <option value="admin">{UI.roles.admin.title}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {UI.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  {UI.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
