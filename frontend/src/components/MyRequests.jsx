import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiEye, FiLoader, FiAlertTriangle, FiPlusCircle } from 'react-icons/fi';
import EventRequestForm from './EventRequestForm'; // To reuse for editing
import { motion, AnimatePresence } from 'framer-motion';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null); // Request object to edit
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('event_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching event requests:', err);
      setError(err.message || 'Failed to fetch your event requests.');
      toast.error(err.message || 'Failed to fetch requests.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleEdit = (request) => {
    setEditingRequest(request);
    setShowFormModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingRequest(null);
    fetchRequests(); // Refresh the list
  }

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }
    try {
      const { error: deleteError } = await supabase
        .from('event_requests')
        .delete()
        .eq('id', requestId)
        .eq('user_id', user.id); // Ensure user can only delete their own

      if (deleteError) throw deleteError;
      toast.success('Event request deleted successfully.');
      fetchRequests(); // Refresh list
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
        <p className="ml-2 text-gray-600">Loading your requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 p-4 rounded-lg">
        <FiAlertTriangle className="text-red-500 h-10 w-10 mx-auto mb-2" />
        <p className="text-red-700">Error: {error}</p>
        <button onClick={fetchRequests} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">My Submitted Event Requests</h2>
        <button
            onClick={() => { setEditingRequest(null); setShowFormModal(true); }}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
            <FiPlusCircle className="mr-2 h-5 w-5"/> New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-6">You haven't submitted any event requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-purple-700">{request.title}</h3>
                  <p className="text-sm text-gray-500">Club: {request.club_name}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Location: {request.location}</p>
                </div>
                <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    {getStatusPill(request.status)}
                    {request.status === 'pending' && (
                    <>
                        <button
                        onClick={() => handleEdit(request)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Edit Request"
                        >
                        <FiEdit className="mr-1 h-4 w-4" /> Edit
                        </button>
                        <button
                        onClick={() => handleDelete(request.id)}
                        className="flex items-center text-sm text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                        title="Delete Request"
                        >
                        <FiTrash2 className="mr-1 h-4 w-4" /> Delete
                        </button>
                    </>
                    )}
                    {/* Optionally, add a view details button/modal */}
                    {/* <button className="text-sm text-gray-600 hover:text-gray-800"><FiEye className="mr-1"/> View</button> */}
                </div>
              </div>
              {request.status === 'rejected' && request.admin_comment && (
                <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">
                    <strong>Admin Comment:</strong> {request.admin_comment}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => { setShowFormModal(false); setEditingRequest(null); }} // Close on backdrop click
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-gray-50 p-0 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <EventRequestForm existingRequest={editingRequest} onFormSubmitSuccess={handleFormSuccess} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRequests;
