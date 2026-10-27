import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertCircle, Trash2, FileSpreadsheet } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { useAuthStore } from '../../stores/auth.store.ts';
import { JournalEntry, JournalLine } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';

export const GeneralJournalPage: React.FC = () => {
  const journals = useAppStore((state) => state.journals);
  const accounts = useAppStore((state) => state.accounts);
  const settings = useAppStore((state) => state.settings);
  const addJournalEntry = useAppStore((state) => state.addJournalEntry);
  const addAuditLog = useAppStore((state) => state.addAuditLog);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('2026-10-27');
  const [memo, setMemo] = useState('');
  const [lines, setLines] = useState<JournalLine[]>([
    {
      accountId: accounts[0]?.id || '',
      accountCode: accounts[0]?.code || '',
      accountName: accounts[0]?.name || '',
      debit: 0,
      credit: 0
    },
    {
      accountId: accounts[1]?.id || '',
      accountCode: accounts[1]?.code || '',
      accountName: accounts[1]?.name || '',
      debit: 0,
      credit: 0
    }
  ]);

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference === 0 && totalDebit > 0;

  const handleAccountChange = (index: number, accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;
    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      accountId: acc.id,
      accountCode: acc.code,
      accountName: acc.name
    };
    setLines(updated);
  };

  const handleAmountChange = (index: number, field: 'debit' | 'credit', value: string) => {
    const num = parseFloat(value) || 0;
    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      [field]: num,
      ...(field === 'debit' && num > 0 ? { credit: 0 } : {}),
      ...(field === 'credit' && num > 0 ? { debit: 0 } : {})
    };
    setLines(updated);
  };

  const handleAddLine = () => {
    const defaultAcc = accounts[0];
    setLines([
      ...lines,
      {
        accountId: defaultAcc?.id || '',
        accountCode: defaultAcc?.code || '',
        accountName: defaultAcc?.name || '',
        debit: 0,
        credit: 0
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced || !memo) return;

    const nextId = `${settings.journalPrefix}${String(journals.length + 1).padStart(3, '0')}`;
    const newEntry: JournalEntry = {
      id: `jv-${Date.now()}`,
      journalNumber: nextId,
      date,
      memo,
      status: 'posted',
      createdBy: currentUser?.fullName || '',
      lines
    };

    addJournalEntry(newEntry);
    if (currentUser) {
      addAuditLog({
        id: `log-${Date.now()}`,
        timestamp: '2026-10-27 08:45:00',
        actor: currentUser.fullName,
        role: currentUser.role,
        actionType: 'CREATE_JOURNAL',
        entity: nextId,
        ipAddress: '192.168.1.104'
      });
    }

    setIsModalOpen(false);
    setMemo('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.accountant.journalTitle}
        subtitle={UI.accountant.journalSubtitle}
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {UI.accountant.journalTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {UI.accountant.journalSubtitle}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.accountant.newJournal}</span>
          </button>
        </div>

        {/* Journals Listing */}
        <div className="space-y-4">
          {journals.map((journal) => {
            const entryTotal = journal.lines.reduce((s, l) => s + l.debit, 0);

            return (
              <div
                key={journal.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      {journal.journalNumber}
                    </span>
                    <span className="text-xs text-slate-500">{journal.date}</span>
                    <span className="text-sm font-medium text-slate-800">
                      {journal.memo}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {UI.common.posted}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(entryTotal)}
                    </span>
                  </div>
                </div>

                <table className="w-full text-left text-sm">
                  <thead className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-4">{UI.accountant.accountCode}</th>
                      <th className="py-2.5 px-4">{UI.accountant.accountName}</th>
                      <th className="py-2.5 px-4 text-right">{UI.common.debit}</th>
                      <th className="py-2.5 px-4 text-right">{UI.common.credit}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {journal.lines.map((l, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-mono text-slate-600 text-xs">
                          {l.accountCode}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">
                          {l.accountName}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-900">
                          {l.debit > 0 ? formatCurrency(l.debit) : UI.common.emptyValue}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-900">
                          {l.credit > 0 ? formatCurrency(l.credit) : UI.common.emptyValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Journal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">
                  {UI.accountant.newJournal}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                {UI.common.close}
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {UI.accountant.journalDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {UI.accountant.memo}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={UI.accountant.memo}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Journal Lines */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">{UI.accountant.accountName}</th>
                      <th className="py-2.5 px-3 text-right w-36">{UI.common.debit}</th>
                      <th className="py-2.5 px-3 text-right w-36">{UI.common.credit}</th>
                      <th className="py-2.5 px-3 text-center w-12">{UI.common.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lines.map((line, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3">
                          <select
                            value={line.accountId}
                            onChange={(e) => handleAccountChange(idx, e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white"
                          >
                            {accounts.map((acc) => (
                              <option key={acc.id} value={acc.id}>
                                {acc.code} - {acc.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={line.debit || ''}
                            onChange={(e) => handleAmountChange(idx, 'debit', e.target.value)}
                            placeholder={UI.common.zeroAmount}
                            className="w-full text-right text-xs font-mono border border-slate-200 rounded p-1.5 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={line.credit || ''}
                            onChange={(e) => handleAmountChange(idx, 'credit', e.target.value)}
                            placeholder={UI.common.zeroAmount}
                            className="w-full text-right text-xs font-mono border border-slate-200 rounded p-1.5 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveLine(idx)}
                            disabled={lines.length <= 2}
                            className="text-slate-400 hover:text-rose-600 disabled:opacity-30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-2 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{UI.accountant.addJournalLine}</span>
                  </button>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span>
                      {UI.accountant.totalDebit}: {formatCurrency(totalDebit)}
                    </span>
                    <span>
                      {UI.accountant.totalCredit}: {formatCurrency(totalCredit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Balance Validation Status */}
              <div
                className={`p-3 rounded-lg border flex items-center gap-2 text-xs font-medium ${
                  isBalanced
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {isBalanced ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{UI.accountant.balancedStatus}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>
                      {UI.accountant.unbalancedStatus} ({UI.accountant.balanceDifference}: {formatCurrency(difference)})
                    </span>
                  </>
                )}
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
                  disabled={!isBalanced || !memo}
                  className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg shadow-sm"
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
