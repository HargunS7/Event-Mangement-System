import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import EventEditor from '../../components/admin/EventEditor'; // Corrected path
import { FiEdit, FiTrash2, FiCheckCircle, FiPlusCircle, FiLoader, FiAlertTriangle, FiCalendar, FiMapPin, FiEyeOff, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // Event object to edit, or null for new

  const fetchAllEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false }); // Show most recent or upcoming first

      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching all events:', err);
      setError(err.message || 'Failed to fetch events.');
      toast.error(err.message || 'Failed to fetch events.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleCreateNew = () => {
    setEditingEvent(null); // Ensure it's a new event form
    setShowEditorModal(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowEditorModal(true);
  };

  const handleEditorClose = () => {
    setShowEditorModal(false);
    setEditingEvent(null);
  }

  const handleEditorSuccess = () => {
    handleEditorClose();
    fetchAllEvents(); // Refresh the list
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to permanently delete this event? This also removes it from public view if approved.')) {
      return;
    }
    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteError) throw deleteError;
      toast.success('Event deleted successfully.');
      fetchAllEvents(); // Refresh list
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error(err.message || 'Failed to delete event.');
    }
  };

  const handleUpdateStatus = async (eventId, newStatus) => {
    // Optional: Add a confirmation for critical status changes like 'cancelled'
    // if (newStatus === 'cancelled' && !window.confirm('Are you sure you want to cancel this event?')) return;

    try {
        const { error: statusError } = await supabase
            .from('events')
            .update({ status: newStatus, updated_at: new Date() })
            .eq('id', eventId);
        if (statusError) throw statusError;
        toast.success(`Event status updated to ${newStatus}.`);
        fetchAllEvents();
    } catch (err) {
        console.error('Error updating event status:', err);
        toast.error(err.message || 'Failed to update event status.');
    }
  };

  const getStatusPill = (status) => {
    // (Same as in AdminRequests, consider moving to a shared util if used in more places)
    switch (status?.toLowerCase()) {
      case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full inline-flex items-center"><FiLoader className="mr-1 animate-spin h-3 w-3"/> Pending</span>;
      case 'approved': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full inline-flex items-center"><FiCheckCircle className="mr-1 h-3 w-3"/> Approved</span>;
      case 'rejected': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full inline-flex items-center"><FiAlertTriangle className="mr-1 h-3 w-3"/> Rejected</span>;
      case 'completed': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full inline-flex items-center"><FiCheckCircle className="mr-1 h-3 w-3"/> Completed</span>;
      case 'cancelled': return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full inline-flex items-center"><FiEyeOff className="mr-1 h-3 w-3"/> Cancelled</span>;
      default: return <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">{status || 'Unknown'}</span>;
    }
  };


  if (isLoading && !showEditorModal) { // Don't show main page loading if editor is open
    return (
      <div className="flex justify-center items-center py-20">
        <FiLoader className="animate-spin text-purple-600 h-12 w-12" />
      </div>
    );
  }

  if (error && !showEditorModal) {
    return (
      <div className="text-center py-10 bg-red-50 p-4 rounded-lg">
        <FiAlertTriangle className="text-red-500 h-10 w-10 mx-auto mb-2" />
        <p className="text-red-700">{error}</p>
        <button onClick={fetchAllEvents} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage All Events</h1>
        <button
          onClick={handleCreateNew}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out text-sm"
        >
          <FiPlusCircle className="mr-2 h-5 w-5" /> Create New Event
        </button>
      </div>

      {events.length === 0 && !isLoading ? (
        <p className="text-gray-500 text-center py-10 text-lg">No events found. Start by creating one!</p>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{event.club_name}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(event.start_date).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{event.location}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusPill(event.status)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button onClick={() => handleEdit(event)} className="text-indigo-600 hover:text-indigo-900 transition-colors" title="Edit Event"><FiEdit size={16}/></button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete Event"><FiTrash2 size={16}/></button>
                    {/* More status update buttons can be added here if needed, e.g., quick complete */}
                    {event.status !== 'completed' && event.status !== 'cancelled' && (
                         <button onClick={() => handleUpdateStatus(event.id, 'completed')} className="text-blue-600 hover:text-blue-900 transition-colors" title="Mark as Completed"><FiCheckCircle size={16}/></button>
                    )}
                     {event.status !== 'approved' && event.status !== 'completed' && event.status !== 'cancelled' && (
                         <button onClick={() => handleUpdateStatus(event.id, 'approved')} className="text-green-600 hover:text-green-900 transition-colors" title="Approve Event"><FiEye size={16}/></button>
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showEditorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]" // Higher z-index
            onClick={handleEditorClose}
          >
            <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] overflow-y-auto rounded-xl">
                 <EventEditor
                    existingEvent={editingEvent}
                    onFormClose={handleEditorClose}
                    onFormSubmitSuccess={handleEditorSuccess}
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEventsPage;
