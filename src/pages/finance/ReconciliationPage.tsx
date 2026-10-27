import React, { useState } from 'react';
import { CheckCircle2, CheckCircle } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatCurrency } from '../../utils/format.ts';

export const ReconciliationPage: React.FC = () => {
  const bankAccounts = useAppStore((state) => state.bankAccounts);
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts[0]?.id || '');
  const [statementBalanceStr, setStatementBalanceStr] = useState('2480000');
  const [isReconciled, setIsReconciled] = useState(false);

  const selectedBank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];
  const bookBalance = selectedBank?.balance || 0;
  const statementBalance = parseFloat(statementBalanceStr) || 0;
  const difference = Math.abs(bookBalance - statementBalance);
  const isMatch = difference === 0;

  const handleConfirmReconcile = () => {
    setIsReconciled(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.finance.reconciliationTitle}
        subtitle={UI.finance.reconciliationSubtitle}
      />

      <div className="p-8 space-y-6">
        {/* Bank Selection */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-slate-700">
              {UI.finance.bankName}:
            </label>
            <select
              value={selectedBankId}
              onChange={(e) => {
                setSelectedBankId(e.target.value);
                const b = bankAccounts.find((acc) => acc.id === e.target.value);
                if (b) setStatementBalanceStr(String(b.balance));
                setIsReconciled(false);
              }}
              className="text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} ({b.accountNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {UI.common.date}: 2026-10-27
          </div>
        </div>

        {/* Reconciliation Comparison Card */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-base">
              {UI.finance.bookBalance}
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-2xl font-bold text-blue-700">
              {formatCurrency(bookBalance)}
            </div>
            <p className="text-xs text-slate-500">
              {selectedBank?.bankName} - {selectedBank?.accountNumber}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-base">
              {UI.finance.bankStatementBalance}
            </h4>
            <input
              type="number"
              step="any"
              value={statementBalanceStr}
              onChange={(e) => {
                setStatementBalanceStr(e.target.value);
                setIsReconciled(false);
              }}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl font-mono text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">
              {UI.finance.reconciliationSubtitle}
            </p>
          </div>
        </div>

        {/* Difference & Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">
              {UI.finance.reconciledDifference}
            </span>
            <span className={`text-xl font-mono font-bold ${isMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(difference)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isMatch && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{UI.finance.reconcileComplete}</span>
              </div>
            )}

            <button
              onClick={handleConfirmReconcile}
              disabled={!isMatch || isReconciled}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isReconciled ? UI.common.approved : UI.finance.reconcileAction}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
