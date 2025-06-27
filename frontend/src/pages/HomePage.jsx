import React from 'react';

const HomePage = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to EventHub!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your one-stop platform for discovering and managing university club events.
      </p>
      <div className="space-x-4">
        <a
          href="/events" // Changed to href for now, will be Link later
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Browse Events
        </a>
        <a
          href="/signup" // Changed to href for now
          className="bg-yellow-400 hover:bg-yellow-500 text-purple-700 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Get Started
        </a>
      </div>
      {/* You can add more sections here, like featured events, how it works, etc. */}
    </div>
  );
};

export default HomePage;
