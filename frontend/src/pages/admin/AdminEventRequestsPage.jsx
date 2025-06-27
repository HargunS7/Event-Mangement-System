import React from 'react';

const AdminEventRequestsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Event Requests</h1>
      <div className="bg-gray-100 p-8 rounded-lg shadow">
        <p className="text-gray-600">Admin event request management interface will be here.</p>
        <p className="text-gray-500 text-sm mt-2">
          Admins will be able to view all incoming event requests and approve, reject, or delete them.
          This page might be integrated into the main Dashboard for admins or be a separate page like this.
        </p>
      </div>
    </div>
  );
};

export default AdminEventRequestsPage;
