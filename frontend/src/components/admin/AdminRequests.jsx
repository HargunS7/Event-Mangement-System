import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient'; // Note the path if this component is in admin folder
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiCheckSquare, FiXSquare, FiTrash2, FiMessageSquare, FiLoader, FiAlertTriangle, FiUser, FiCalendar, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminRequests = () => {
  const { user } = useAuth(); // To ensure only admins access this functionality (though route protection is primary)
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectingRequest, setRejectingRequest] = useState(null); // { id: requestId, comment: '' }
  const [adminComment, setAdminComment] = useState('');

  const fetchAllRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('event_requests')
        .select(`
          *,
          profiles ( username, email )
        `) // Fetch related user profile (username or email)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching all event requests:', err);
      setError(err.message || 'Failed to fetch event requests.');
      toast.error(err.message || 'Failed to fetch requests.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllRequests();
    }
  }, [user, fetchAllRequests]);

  const handleUpdateRequestStatus = async (requestId, status, comment = null) => {
    try {
      const updatePayload = { status };
      if (comment) {
        updatePayload.admin_comment = comment;
      }

      const { error: updateError } = await supabase
        .from('event_requests')
        .update(updatePayload)
        .eq('id', requestId);

      if (updateError) throw updateError;
      toast.success(`Event request ${status}.`);
      fetchAllRequests(); // Refresh list
      if (rejectingRequest) setRejectingRequest(null); // Close reject modal
      setAdminComment(''); // Clear comment
    } catch (err) {
      console.error(`Error updating request to ${status}:`, err);
      toast.error(err.message || `Failed to update request.`);
    }
  };

  const openRejectModal = (request) => {
    setRejectingRequest(request);
    setAdminComment(request.admin_comment || ''); // Pre-fill if already commented
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to permanently delete this request?')) {
      return;
    }
    try {
      const { error: deleteError } = await supabase
        .from('event_requests')
        .delete()
        .eq('id', requestId);

      if (deleteError) throw deleteError;
      toast.success('Event request deleted successfully.');
      fetchAllRequests(); // Refresh list
    } catch (err) {
      console.error('Error deleting request:', err);
      toast.error(err.message || 'Failed to delete request.');
    }
  };

  const getStatusPill = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">{status || 'Unknown'}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FiLoader className="animate-spin text-purple-600 h-8 w-8" />
        <p className="ml-2 text-gray-600">Loading all requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 p-4 rounded-lg">
        <FiAlertTriangle className="text-red-500 h-10 w-10 mx-auto mb-2" />
        <p className="text-red-700">Error: {error}</p>
        <button onClick={fetchAllRequests} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Try Again
        </button>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return <p className="text-red-500">You are not authorized to view this section.</p>;
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage All Event Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No event requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Club</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates & Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.title}</div>
                    <div className="text-xs text-gray-500">{request.club_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                        <FiUser className="h-4 w-4 mr-1 text-gray-400"/>
                        {request.profiles?.username || request.profiles?.email || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">ID: {request.user_id.substring(0,8)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center"><FiCalendar className="h-4 w-4 mr-1 text-gray-400"/> {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</div>
                    <div className="flex items-center mt-1"><FiMapPin className="h-4 w-4 mr-1 text-gray-400"/> {request.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusPill(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateRequestStatus(request.id, 'approved')} className="text-green-600 hover:text-green-900" title="Approve"><FiCheckSquare size={18}/></button>
                        <button onClick={() => openRejectModal(request)} className="text-red-600 hover:text-red-900" title="Reject"><FiXSquare size={18}/></button>
                      </>
                    )}
                     {request.status === 'rejected' && !request.admin_comment && ( // Allow adding comment if rejected without one
                        <button onClick={() => openRejectModal(request)} className="text-yellow-600 hover:text-yellow-900" title="Add/Edit Reject Comment"><FiMessageSquare size={18}/></button>
                     )}
                    <button onClick={() => handleDelete(request.id)} className="text-gray-500 hover:text-red-700" title="Delete"><FiTrash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {request.admin_comment && (
            <div className="mt-1 px-6 py-1 text-xs text-gray-600 bg-gray-50 border-t">
                <strong>Admin:</strong> {request.admin_comment}
            </div>
            )}
        </div>
      )}

      {rejectingRequest && (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            onClick={() => setRejectingRequest(null)}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Reject Event Request: {rejectingRequest.title}</h3>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Reason for rejection (optional, but recommended)"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            ></textarea>
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setRejectingRequest(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
              <button
                onClick={() => handleUpdateRequestStatus(rejectingRequest.id, 'rejected', adminComment)}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Confirm Rejection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminRequests;
