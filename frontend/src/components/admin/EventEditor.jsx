import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiType, FiFileText, FiHash, FiSave, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; // Added FiCheckCircle
import { motion } from 'framer-motion';

const EventEditor = ({ existingEvent, onFormClose, onFormSubmitSuccess }) => {
  const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      club_name: '',
      title: '',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      status: 'pending', // Default status for new events
    }
  });

  useEffect(() => {
    if (existingEvent) {
      // Format dates for datetime-local input
      const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        try {
          const date = new Date(isoString);
          // Check if date is valid before trying to get parts
          if (isNaN(date.getTime())) return '';
          return date.toISOString().substring(0, 16);
        } catch (e) {
          console.error("Error formatting date:", isoString, e);
          return '';
        }
      };

      setValue('club_name', existingEvent.club_name || '');
      setValue('title', existingEvent.title || '');
      setValue('description', existingEvent.description || '');
      setValue('location', existingEvent.location || '');
      setValue('start_date', formatDateTimeLocal(existingEvent.start_date));
      setValue('end_date', formatDateTimeLocal(existingEvent.end_date));
      setValue('status', existingEvent.status || 'pending');
    } else {
      reset({ // Reset to default for new event form
        club_name: '',
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        status: 'pending',
      });
    }
  }, [existingEvent, setValue, reset]);

  const onSubmit = async (data) => {
    const submissionData = {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
    };

    if (new Date(submissionData.start_date) >= new Date(submissionData.end_date)) {
        toast.error("End date must be after start date.");
        return;
    }

    try {
      let responseError;
      let successMessage;

      if (existingEvent?.id) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(submissionData)
          .eq('id', existingEvent.id);
        responseError = error;
        successMessage = 'Event updated successfully!';
      } else {
        // Create new event (from an approved request or manually)
        const { error } = await supabase
          .from('events')
          .insert(submissionData);
        responseError = error;
        successMessage = 'Event created successfully!';
      }

      if (responseError) throw responseError;

      toast.success(successMessage);
      reset();
      if (onFormSubmitSuccess) onFormSubmitSuccess();
      if (onFormClose) onFormClose();

    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error.message || 'Failed to save event.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-auto my-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {existingEvent?.id ? 'Edit Event' : 'Create New Event'}
        </h2>
        {onFormClose && (
          <button onClick={onFormClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Club Name */}
        <div>
          <label htmlFor="club_name_editor" className="block text-sm font-medium text-gray-700 mb-1">Club/Organization Name</label>
          <div className="relative">
            <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="text" id="club_name_editor" {...register("club_name", { required: "Club name is required" })}
              className={`w-full pl-10 pr-3 py-2 border ${errors.club_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="e.g., Tech Innovators Club" />
          </div>
          {errors.club_name && <p className="mt-1 text-xs text-red-600">{errors.club_name.message}</p>}
        </div>

        {/* Event Title */}
        <div>
          <label htmlFor="title_editor" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
          <div className="relative">
            <FiType className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="text" id="title_editor" {...register("title", { required: "Event title is required" })}
              className={`w-full pl-10 pr-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="e.g., Annual Tech Symposium" />
          </div>
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description_editor" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <FiFileText className="absolute left-3 top-3 text-gray-400 h-5 w-5 pointer-events-none" />
            <textarea id="description_editor" {...register("description", { required: "Description is required" })} rows="4"
              className={`w-full pl-10 pr-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="Provide details about the event, speakers, schedule, etc."></textarea>
          </div>
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location_editor" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="text" id="location_editor" {...register("location", { required: "Location is required" })}
              className={`w-full pl-10 pr-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="e.g., Main Campus Hall, Online via Zoom" />
          </div>
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="start_date_editor" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input type="datetime-local" id="start_date_editor" {...register("start_date", { required: "Start date is required" })}
                className={`w-full pl-10 pr-3 py-2 border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`} />
            </div>
            {errors.start_date && <p className="mt-1 text-xs text-red-600">{errors.start_date.message}</p>}
          </div>
          <div>
            <label htmlFor="end_date_editor" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input type="datetime-local" id="end_date_editor" {...register("end_date", { required: "End date is required" })}
                className={`w-full pl-10 pr-3 py-2 border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm`} />
            </div>
            {errors.end_date && <p className="mt-1 text-xs text-red-600">{errors.end_date.message}</p>}
          </div>
        </div>

        {/* Status */}
        <div>
            <label htmlFor="status_editor" className="block text-sm font-medium text-gray-700 mb-1">Event Status</label>
            <div className="relative">
                <FiCheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                <select id="status_editor" {...register("status", { required: "Status is required" })}
                    className={`w-full pl-10 pr-3 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm appearance-none`}
                >
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved & Live</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
            </div>
            {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
        </div>


        <div className="flex items-center justify-end space-x-4 pt-2">
            {onFormClose && (
                 <button
                    type="button"
                    onClick={onFormClose}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                >
                    Cancel
                </button>
            )}
            <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition duration-150 ease-in-out"
            >
            <FiSave className="mr-2 h-5 w-5" />
            {isSubmitting ? (existingEvent?.id ? 'Updating...' : 'Creating...') : (existingEvent?.id ? 'Save Changes' : 'Create Event')}
            </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EventEditor;
