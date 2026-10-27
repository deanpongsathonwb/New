import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Receipt,
  FileCheck2,
  Building2,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI, ROUTES } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { formatCurrency, formatNumber } from '../../utils/format.ts';

export const FinanceDashboardPage: React.FC = () => {
  const invoices = useAppStore((state) => state.invoices);
  const bills = useAppStore((state) => state.bills);
  const bankAccounts = useAppStore((state) => state.bankAccounts);

  const totalCashBank = bankAccounts.reduce((sum, b) => sum + b.balance, 0);

  const totalReceivables = invoices
    .filter((inv) => inv.status !== 'paid' && inv.status !== 'void')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const totalPayables = bills
    .filter((bill) => bill.status !== 'paid' && bill.status !== 'void')
    .reduce((sum, bill) => sum + bill.grandTotal, 0);

  const netLiquidity = totalCashBank + totalReceivables - totalPayables;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.navigation.finance.dashboard}
        subtitle={UI.roles.finance.responsibility}
      />

      <div className="p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.finance.bankTitle}
            </span>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(totalCashBank)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <Building2 className="w-3.5 h-3.5" />
              <span>{formatNumber(bankAccounts.length)} {UI.units.accounts}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.finance.invoicesTitle}
            </span>
            <p className="text-xl font-bold text-emerald-700">
              {formatCurrency(totalReceivables)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatNumber(invoices.filter((i) => i.status !== 'paid').length)} {UI.units.items}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.finance.billsTitle}
            </span>
            <p className="text-xl font-bold text-rose-700">
              {formatCurrency(totalPayables)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{formatNumber(bills.filter((b) => b.status !== 'paid').length)} {UI.units.items}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {UI.auditor.liquiditySummary}
            </span>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(netLiquidity)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{UI.admin.healthy}</span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-4 gap-4">
          <NavLink
            to={ROUTES.FINANCE.INVOICES}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.finance.invoices}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>

          <NavLink
            to={ROUTES.FINANCE.BILLS}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.finance.bills}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>

          <NavLink
            to={ROUTES.FINANCE.BANK_ACCOUNTS}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.finance.bankAccounts}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>

          <NavLink
            to={ROUTES.FINANCE.RECONCILIATION}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {UI.navigation.finance.reconciliation}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </NavLink>
        </div>

        {/* Invoices Pending Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">
              {UI.finance.invoicesTitle}
            </h3>
            <NavLink
              to={ROUTES.FINANCE.INVOICES}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{UI.common.view}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{UI.finance.invoiceNo}</th>
                <th className="py-3 px-4">{UI.finance.customer}</th>
                <th className="py-3 px-4">{UI.finance.dueDate}</th>
                <th className="py-3 px-4 text-right">{UI.finance.grandTotal}</th>
                <th className="py-3 px-4 text-center">{UI.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-medium text-blue-700">
                    {inv.invoiceNo}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{inv.customer}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                    {formatCurrency(inv.grandTotal)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inv.status === 'overdue'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {inv.status === 'paid'
                        ? UI.common.paid
                        : inv.status === 'overdue'
                        ? UI.common.overdue
                        : UI.common.pending}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
