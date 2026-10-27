import React, { useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';
import { SystemSettings } from '../../types/common.types.ts';

export const SettingsPage: React.FC = () => {
  const currentSettings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);

  const [formData, setFormData] = useState<SystemSettings>({ ...currentSettings });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleChange = (field: keyof SystemSettings, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.admin.settingsTitle}
        subtitle={UI.admin.settingsSubtitle}
      />

      <div className="p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {UI.admin.settingsTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {UI.admin.settingsSubtitle}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{UI.admin.saveSettings}</span>
            </button>
          </div>

          {/* Form Sections */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 1. System Owner */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.systemOwner}
                </label>
                <input
                  type="text"
                  required
                  value={formData.systemOwner}
                  onChange={(e) => handleChange('systemOwner', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* 2. Tax ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.taxId}
                </label>
                <input
                  type="text"
                  required
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* 3. Fiscal Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.fiscalYear}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fiscalYear}
                  onChange={(e) => handleChange('fiscalYear', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* 4. Accounting Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.accountingMethod}
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountingMethod}
                  onChange={(e) => handleChange('accountingMethod', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* 5. Default VAT Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.defaultVatRate}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.defaultVatRate}
                  onChange={(e) => handleChange('defaultVatRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* 6. Withholding Tax Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.withholdingTaxRate}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.withholdingTaxRate}
                  onChange={(e) => handleChange('withholdingTaxRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* 7. Invoice Prefix */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.invoicePrefix}
                </label>
                <input
                  type="text"
                  required
                  value={formData.invoicePrefix}
                  onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* 8. Bill Prefix */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.billPrefix}
                </label>
                <input
                  type="text"
                  required
                  value={formData.billPrefix}
                  onChange={(e) => handleChange('billPrefix', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* 9. Journal Prefix */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.journalPrefix}
                </label>
                <input
                  type="text"
                  required
                  value={formData.journalPrefix}
                  onChange={(e) => handleChange('journalPrefix', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* 10. Currency Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {UI.settingsFields.currencyCode}
                </label>
                <input
                  type="text"
                  required
                  value={formData.currencyCode}
                  onChange={(e) => handleChange('currencyCode', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* 11. Allow Backdated */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowBackdatedEntries}
                  onChange={(e) => handleChange('allowBackdatedEntries', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {UI.settingsFields.allowBackdatedEntries}
                </span>
              </label>

              {/* 12. Require Double Approval */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireDoubleApproval}
                  onChange={(e) => handleChange('requireDoubleApproval', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {UI.settingsFields.requireDoubleApproval}
                </span>
              </label>

              {/* 13. Auto Journal Numbering */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoJournalNumbering}
                  onChange={(e) => handleChange('autoJournalNumbering', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {UI.settingsFields.autoJournalNumbering}
                </span>
              </label>
            </div>
          </div>
        </form>

        {showSuccessToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg animate-slide-up text-sm font-medium">
            <CheckCircle2 className="w-5 h-5" />
            <span>{UI.admin.settingsSavedSuccess}</span>
          </div>
        )}
      </div>
    </div>
  );
};
