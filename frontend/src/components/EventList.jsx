import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiUsers, FiInfo, FiLoader, FiAlertTriangle, FiTag } from 'react-icons/fi'; // FiTag for club name
import { motion } from 'framer-motion';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApprovedEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('events') // Assuming your approved events are in an 'events' table
        .select('*')
        .eq('status', 'approved') // Filter for approved events
        .order('start_date', { ascending: true }); // Show upcoming events first

      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching approved events:', err);
      setError(err.message || 'Failed to fetch events.');
      toast.error(err.message || 'Failed to fetch events.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedEvents();
  }, [fetchApprovedEvents]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FiLoader className="animate-spin text-purple-600 h-12 w-12" />
        <p className="ml-3 text-lg text-gray-600">Loading upcoming events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 p-6 rounded-lg shadow-md">
        <FiAlertTriangle className="text-red-600 h-12 w-12 mx-auto mb-4" />
        <p className="text-xl text-red-700 mb-3">Oops! Something went wrong.</p>
        <p className="text-md text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchApprovedEvents}
          className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-150 ease-in-out"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <FiCalendar className="text-gray-400 h-16 w-16 mx-auto mb-4" />
        <p className="text-xl text-gray-500">No approved events found at the moment.</p>
        <p className="text-md text-gray-400 mt-2">Please check back later or contact an admin if you think this is an error.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {events.map((event) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: events.indexOf(event) * 0.05 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Optional: Event Image Placeholder
          <div className="w-full h-48 bg-purple-200 flex items-center justify-center">
            <FiImage className="h-16 w-16 text-purple-400" />
          </div>
          */}
          <div className="p-6 flex-grow">
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                <FiTag className="mr-1.5 h-4 w-4" />
                {event.club_name || 'University Event'}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <FiCalendar className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                <span>
                  {new Date(event.start_date).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} -
                  {new Date(event.end_date).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                  {new Date(event.start_date).toLocaleDateString() !== new Date(event.end_date).toLocaleDateString() ? ` (ends ${new Date(event.end_date).toLocaleDateString()})` : ''}
                </span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mt-4 line-clamp-3">
              {event.description}
            </p>
          </div>

          {/* Optional: Footer for actions like "View Details" or "RSVP" */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <button className="w-full text-purple-600 font-semibold hover:text-purple-800 hover:bg-purple-100 py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm flex items-center justify-center">
                <FiInfo className="mr-2 h-4 w-4"/> View Details (Coming Soon)
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EventList;
