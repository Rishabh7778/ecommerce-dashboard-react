import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Admin ka Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Outlet ka matlab hai ki jo bhi admin route hoga, wo yahan render hoga */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;