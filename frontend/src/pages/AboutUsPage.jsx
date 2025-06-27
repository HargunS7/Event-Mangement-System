import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="prose max-w-none"> {/* Using Tailwind Typography for nice default styling */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">About EventHub</h1>

      <p>
        EventHub is a centralized platform designed to streamline the discovery, creation, and management of events
        for university clubs and organizations. Our mission is to foster a vibrant campus community by making it
        easier for students to connect with events that match their interests and for clubs to reach a wider audience.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">Our Vision</h2>
      <p>
        We envision a campus where every student can easily find and participate in a rich tapestry of events,
        enhancing their university experience, broadening their horizons, and building lasting connections.
        We aim to empower clubs by providing them with intuitive tools to promote their activities and manage participation.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">For Students</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Discover a wide range of events happening across campus.</li>
        <li>Filter events by club, category, or date.</li>
        <li>Stay updated on your favorite clubs' activities.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">For Clubs</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Easily submit event requests for approval.</li>
        <li>Manage your approved events through a dedicated admin panel.</li>
        <li>Reach a broader student audience and increase event attendance.</li>
        <li>Track event interest and manage logistics more effectively.</li>
      </ul>

      <p className="mt-8">
        EventHub is continuously evolving, and we are committed to adding new features and improvements based on
        feedback from our users. Join us in making campus life more engaging and connected!
      </p>
    </div>
  );
};

export default AboutUsPage;
