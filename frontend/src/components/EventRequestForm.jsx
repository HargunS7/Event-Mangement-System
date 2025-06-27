import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../../supabaseClient'; // Direct Supabase client for this form
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiType, FiFileText, FiHash, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
// Consider using a date picker library for better UX if needed
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';


const EventRequestForm = ({ existingRequest, onFormSubmitSuccess }) => {
  const { user } = useAuth();
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      club_name: existingRequest?.club_name || '',
      title: existingRequest?.title || '',
      description: existingRequest?.description || '',
      location: existingRequest?.location || '',
      start_date: existingRequest?.start_date ? new Date(existingRequest.start_date).toISOString().substring(0, 16) : '', // Format for datetime-local
      end_date: existingRequest?.end_date ? new Date(existingRequest.end_date).toISOString().substring(0, 16) : '',       // Format for datetime-local
    }
  });

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("You must be logged in to submit an event request.");
      return;
    }

    // Convert local datetime strings back to full ISO strings for Supabase
    const submissionData = {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
      user_id: user.id, // Ensure user_id is included
      status: existingRequest?.status || 'pending', // Preserve status if editing, default to pending
    };

    if (new Date(submissionData.start_date) >= new Date(submissionData.end_date)) {
        toast.error("End date must be after start date.");
        return;
    }

    try {
      let responseError;
      if (existingRequest?.id) {
        // Update existing request
        const { error } = await supabase
          .from('event_requests')
          .update(submissionData)
          .eq('id', existingRequest.id)
          .eq('user_id', user.id); // Ensure user can only update their own requests
        responseError = error;
      } else {
        // Create new request
        const { error } = await supabase
          .from('event_requests')
          .insert(submissionData);
        responseError = error;
      }

      if (responseError) throw responseError;

      toast.success(existingRequest?.id ? 'Event request updated successfully!' : 'Event request submitted successfully!');
      reset(); // Reset form fields
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess(); // Callback to refresh list or close modal
      }

    } catch (error) {
      console.error('Error submitting event request:', error);
      toast.error(error.message || 'Failed to submit event request.');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        {existingRequest?.id ? 'Update Event Request' : 'Submit New Event Request'}
      </h2>

      {/* Club Name */}
      <div>
        <label htmlFor="club_name" className="block text-sm font-medium text-gray-700 mb-1">Club/Organization Name</label>
        <div className="relative">
          <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          <input type="text" id="club_name" {...register("club_name", { required: "Club name is required" })}
            className={`w-full pl-10 pr-3 py-2 border ${errors.club_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
            placeholder="e.g., Coding Club" />
        </div>
        {errors.club_name && <p className="mt-1 text-xs text-red-600">{errors.club_name.message}</p>}
      </div>

      {/* Event Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
        <div className="relative">
          <FiType className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          <input type="text" id="title" {...register("title", { required: "Event title is required" })}
            className={`w-full pl-10 pr-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
            placeholder="e.g., Introduction to React Workshop" />
        </div>
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <div className="relative">
          <FiFileText className="absolute left-3 top-3 text-gray-400 h-5 w-5 pointer-events-none" />
          <textarea id="description" {...register("description", { required: "Description is required" })} rows="4"
            className={`w-full pl-10 pr-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
            placeholder="Detailed information about the event..."></textarea>
        </div>
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          <input type="text" id="location" {...register("location", { required: "Location is required" })}
            className={`w-full pl-10 pr-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
            placeholder="e.g., University Auditorium, Room 101" />
        </div>
        {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="datetime-local" id="start_date" {...register("start_date", { required: "Start date is required" })}
              className={`w-full pl-10 pr-3 py-2 border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`} />
          </div>
          {errors.start_date && <p className="mt-1 text-xs text-red-600">{errors.start_date.message}</p>}
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="datetime-local" id="end_date" {...register("end_date", { required: "End date is required" })}
              className={`w-full pl-10 pr-3 py-2 border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`} />
          </div>
          {errors.end_date && <p className="mt-1 text-xs text-red-600">{errors.end_date.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition duration-150 ease-in-out"
      >
        <FiSend className="mr-2 h-5 w-5" />
        {isSubmitting ? (existingRequest?.id ? 'Updating Request...' : 'Submitting Request...') : (existingRequest?.id ? 'Update Event Request' : 'Submit Event Request')}
      </button>
    </motion.form>
  );
};

export default EventRequestForm;
