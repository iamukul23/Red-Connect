import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64 flex flex-col flex-1 min-h-0">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
