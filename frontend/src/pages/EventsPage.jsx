import React from 'react';
import EventList from '../components/EventList'; // Corrected path
import { motion } from 'framer-motion';

const EventsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Upcoming Events</h1>
        <p className="text-lg text-gray-600">Discover what's happening around campus.</p>
      </div>

      <EventList />

    </motion.div>
  );
};

export default EventsPage;
