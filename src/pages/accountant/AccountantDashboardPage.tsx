import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  FileSpreadsheet,
  Scale,
  PieChart,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatCurrency, formatNumber } from '../../utils/format.ts';

export const AccountantDashboardPage: React.FC = () => {
  const accounts = useAppStore((state) => state.accounts);
  const journals = useAppStore((state) => state.journals);

  const totalAssets = accounts
    .filter((a) => a.type === 'asset')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.type === 'liability')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalEquity = accounts
    .filter((a) => a.type === 'equity')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalRevenues = accounts
    .filter((a) => a.type === 'revenue')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalExpenses = accounts
    .filter((a) => a.type === 'expense')
    .reduce((sum, a) => sum + a.balance, 0);

  const netIncome = totalRevenues - totalExpenses;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.navigation.accountant.dashboard}
        subtitle={UI.roles.accountant.responsibility}
      />

      <div className="p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.accountant.types.asset}
            </span>
            <p className="text-xl font-bold text-slate-800">
              {formatCurrency(totalAssets)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{UI.accountant.coaSubtitle}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.accountant.types.liability}
            </span>
            <p className="text-xl font-bold text-slate-800">
              {formatCurrency(totalLiabilities)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatNumber(accounts.filter((a) => a.type === 'liability').length)} {UI.units.accounts}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.accountant.types.equity}
            </span>
            <p className="text-xl font-bold text-slate-800">
              {formatCurrency(totalEquity)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
              <span>{UI.accountant.accountingEquationCheck}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.accountant.netIncome}
            </span>
            <p className={`text-xl font-bold ${netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(netIncome)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{UI.accountant.incomeStatementTab}</span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-4 gap-4">
          <NavLink
            to={ROUTES.ACCOUNTANT.CHART_OF_ACCOUNTS}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.accountant.chartOfAccounts}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>

          <NavLink
            to={ROUTES.ACCOUNTANT.GENERAL_JOURNAL}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.accountant.generalJournal}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>

          <NavLink
            to={ROUTES.ACCOUNTANT.TRIAL_BALANCE}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.accountant.trialBalance}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>

          <NavLink
            to={ROUTES.ACCOUNTANT.FINANCIAL_STATEMENTS}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.accountant.financialStatements}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>
        </div>

        {/* Recent Journal Entries Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {UI.accountant.journalTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {UI.accountant.journalSubtitle}
              </p>
            </div>
            <NavLink
              to={ROUTES.ACCOUNTANT.GENERAL_JOURNAL}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{UI.common.view}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{UI.accountant.journalNumber}</th>
                <th className="py-3 px-4">{UI.common.date}</th>
                <th className="py-3 px-4">{UI.accountant.memo}</th>
                <th className="py-3 px-4 text-right">{UI.common.amount}</th>
                <th className="py-3 px-4 text-center">{UI.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journals.slice(0, 5).map((j) => {
                const totalAmount = j.lines.reduce((s, l) => s + l.debit, 0);
                return (
                  <tr key={j.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {j.journalNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{j.date}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{j.memo}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                      {formatCurrency(totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {UI.common.posted}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
