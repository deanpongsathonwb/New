import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
};
