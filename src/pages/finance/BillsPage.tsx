import React, { useState } from 'react';
import { Plus, Search, Filter, FileCheck2, CheckCircle } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { BillItem } from '../../types/common.types.ts';
import { formatCurrency } from '../../utils/format.ts';

export const BillsPage: React.FC = () => {
  const bills = useAppStore((state) => state.bills);
  const settings = useAppStore((state) => state.settings);
  const addBill = useAppStore((state) => state.addBill);
  const updateBillStatus = useAppStore((state) => state.updateBillStatus);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New bill state
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [subtotalStr, setSubtotalStr] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const subtotal = parseFloat(subtotalStr) || 0;
  const vatAmount = (subtotal * settings.defaultVatRate) / 100;
  const grandTotal = subtotal + vatAmount;

  const filtered = bills.filter((b) => {
    const matchesSearch =
      b.billNo.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || subtotal <= 0) return;

    const nextNo = `${settings.billPrefix}${String(bills.length + 1).padStart(3, '0')}`;
    const newBillItem: BillItem = {
      id: `bill-${Date.now()}`,
      billNo: nextNo,
      vendor,
      issueDate: '2026-10-27',
      dueDate,
      subtotal,
      vatAmount,
      grandTotal,
      status: 'pending',
      description
    };

    addBill(newBillItem);
    setIsModalOpen(false);
    setVendor('');
    setDescription('');
    setSubtotalStr('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.finance.billsTitle}
        subtitle={UI.finance.billsSubtitle}
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={UI.common.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{UI.common.all}</option>
                <option value="pending">{UI.common.pending}</option>
                <option value="paid">{UI.common.paid}</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{UI.finance.newBill}</span>
          </button>
        </div>

        {/* Bills Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{UI.finance.billNo}</th>
                <th className="py-3 px-4">{UI.finance.vendor}</th>
                <th className="py-3 px-4">{UI.finance.issueDate}</th>
                <th className="py-3 px-4">{UI.finance.dueDate}</th>
                <th className="py-3 px-4 text-right">{UI.finance.subtotal}</th>
                <th className="py-3 px-4 text-right">{UI.finance.grandTotal}</th>
                <th className="py-3 px-4 text-center">{UI.common.status}</th>
                <th className="py-3 px-4 text-center">{UI.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {b.billNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{b.vendor}</p>
                    <p className="text-xs text-slate-500">{b.description}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">{b.issueDate}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">{b.dueDate}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    {formatCurrency(b.subtotal)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(b.grandTotal)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        b.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {b.status === 'paid' ? UI.common.paid : UI.common.pending}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {b.status !== 'paid' ? (
                      <button
                        onClick={() => updateBillStatus(b.id, 'paid')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{UI.finance.recordDisbursement}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">{UI.common.emptyValue}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">
                  {UI.finance.newBill}
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
                  {UI.finance.vendor}
                </label>
                <input
                  type="text"
                  required
                  placeholder={UI.finance.vendor}
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.common.description}
                </label>
                <input
                  type="text"
                  placeholder={UI.common.description}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {UI.finance.subtotal}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder={UI.common.zeroAmount}
                    value={subtotalStr}
                    onChange={(e) => setSubtotalStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {UI.finance.dueDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>{UI.finance.vatAmount}:</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>{UI.finance.grandTotal}:</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
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
