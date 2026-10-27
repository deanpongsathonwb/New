import { create } from 'zustand';
import {
  AccountItem,
  JournalEntry,
  InvoiceItem,
  BillItem,
  BankAccountItem,
  AuditLogItem,
  SystemSettings,
  User
} from '../types/common.types.ts';
import { STORAGE_KEYS } from '../constants/storage.ts';
import { storageService } from '../storage/localStorage/localStorage.service.ts';

import seedAccounts from '../seed/accounts.json';
import seedJournals from '../seed/journals.json';
import seedInvoices from '../seed/invoices.json';
import seedBills from '../seed/bills.json';
import seedBankAccounts from '../seed/bankAccounts.json';
import seedUsers from '../seed/users.json';
import seedSettings from '../seed/settings.json';
import seedAuditLogs from '../seed/auditLogs.json';

interface AppPersistedState {
  accounts: AccountItem[];
  journals: JournalEntry[];
  invoices: InvoiceItem[];
  bills: BillItem[];
  bankAccounts: BankAccountItem[];
  users: User[];
  settings: SystemSettings;
  auditLogs: AuditLogItem[];
}

interface AppStore extends AppPersistedState {
  addAccount: (account: AccountItem) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  addInvoice: (invoice: InvoiceItem) => void;
  updateInvoiceStatus: (id: string, status: InvoiceItem['status']) => void;
  addBill: (bill: BillItem) => void;
  updateBillStatus: (id: string, status: BillItem['status']) => void;
  updateSettings: (newSettings: SystemSettings) => void;
  addUser: (user: User) => void;
  addAuditLog: (log: AuditLogItem) => void;
  resetAllData: () => void;
}

const getInitialState = (): AppPersistedState => {
  const stored = storageService.getItem<AppPersistedState>(STORAGE_KEYS.APP_DATA);
  if (stored) {
    return stored;
  }
  return {
    accounts: seedAccounts as AccountItem[],
    journals: seedJournals as JournalEntry[],
    invoices: seedInvoices as InvoiceItem[],
    bills: seedBills as BillItem[],
    bankAccounts: seedBankAccounts as BankAccountItem[],
    users: seedUsers as User[],
    settings: seedSettings as SystemSettings,
    auditLogs: seedAuditLogs as AuditLogItem[]
  };
};

export const useAppStore = create<AppStore>((set, get) => {
  const initial = getInitialState();

  const persist = (nextState: Partial<AppPersistedState>) => {
    const currentState = get();
    const updated: AppPersistedState = {
      accounts: nextState.accounts ?? currentState.accounts,
      journals: nextState.journals ?? currentState.journals,
      invoices: nextState.invoices ?? currentState.invoices,
      bills: nextState.bills ?? currentState.bills,
      bankAccounts: nextState.bankAccounts ?? currentState.bankAccounts,
      users: nextState.users ?? currentState.users,
      settings: nextState.settings ?? currentState.settings,
      auditLogs: nextState.auditLogs ?? currentState.auditLogs
    };
    storageService.setItem(STORAGE_KEYS.APP_DATA, updated);
  };

  return {
    ...initial,

    addAccount: (account) => {
      set((state) => {
        const next = [account, ...state.accounts];
        persist({ accounts: next });
        return { accounts: next };
      });
    },

    addJournalEntry: (entry) => {
      set((state) => {
        const next = [entry, ...state.journals];
        persist({ journals: next });
        return { journals: next };
      });
    },

    addInvoice: (invoice) => {
      set((state) => {
        const next = [invoice, ...state.invoices];
        persist({ invoices: next });
        return { invoices: next };
      });
    },

    updateInvoiceStatus: (id, status) => {
      set((state) => {
        const next = state.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv));
        persist({ invoices: next });
        return { invoices: next };
      });
    },

    addBill: (bill) => {
      set((state) => {
        const next = [bill, ...state.bills];
        persist({ bills: next });
        return { bills: next };
      });
    },

    updateBillStatus: (id, status) => {
      set((state) => {
        const next = state.bills.map((b) => (b.id === id ? { ...b, status } : b));
        persist({ bills: next });
        return { bills: next };
      });
    },

    updateSettings: (newSettings) => {
      set(() => {
        persist({ settings: newSettings });
        return { settings: newSettings };
      });
    },

    addUser: (user) => {
      set((state) => {
        const next = [...state.users, user];
        persist({ users: next });
        return { users: next };
      });
    },

    addAuditLog: (log) => {
      set((state) => {
        const next = [log, ...state.auditLogs];
        persist({ auditLogs: next });
        return { auditLogs: next };
      });
    },

    resetAllData: () => {
      const resetState: AppPersistedState = {
        accounts: seedAccounts as AccountItem[],
        journals: seedJournals as JournalEntry[],
        invoices: seedInvoices as InvoiceItem[],
        bills: seedBills as BillItem[],
        bankAccounts: seedBankAccounts as BankAccountItem[],
        users: seedUsers as User[],
        settings: seedSettings as SystemSettings,
        auditLogs: seedAuditLogs as AuditLogItem[]
      };
      persist(resetState);
      set(resetState);
    }
  };
});
