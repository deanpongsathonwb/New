import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';

export const AuditTrailPage: React.FC = () => {
  const auditLogs = useAppStore((state) => state.auditLogs);
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.actionType.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.auditor.auditTrailTitle}
        subtitle={UI.auditor.auditTrailSubtitle}
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={UI.common.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{UI.admin.healthy}</span>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{UI.auditor.timestamp}</th>
                <th className="py-3 px-4">{UI.auditor.actor}</th>
                <th className="py-3 px-4">{UI.auth.roleLabel}</th>
                <th className="py-3 px-4">{UI.auditor.actionType}</th>
                <th className="py-3 px-4">{UI.auditor.entity}</th>
                <th className="py-3 px-4 font-mono text-xs">{UI.auditor.ipAddress}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{log.actor}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                      {UI.roles[log.role].title}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-900">
                    {log.actionType}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-700">{log.entity}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
