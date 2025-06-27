import React from 'react';

const ContactPage = () => {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h1>

      <p>
        We'd love to hear from you! Whether you have a question, feedback, or need support,
        please feel free to reach out to us.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">General Inquiries</h2>
      <p>
        For general questions about EventHub, partnerships, or media inquiries, please email us at:
        <br />
        <a href="mailto:info@eventhub.example.com" className="text-purple-600 hover:text-purple-800">
          info@eventhub.example.com
        </a>
        (Please replace with a real email address).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">Technical Support</h2>
      <p>
        If you are experiencing technical difficulties or have found a bug, please contact our support team:
        <br />
        <a href="mailto:support@eventhub.example.com" className="text-purple-600 hover:text-purple-800">
          support@eventhub.example.com
        </a>
        (Please replace with a real email address).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">Feedback</h2>
      <p>
        Your feedback is important to us and helps us improve EventHub. Please share your thoughts and suggestions by emailing:
        <br />
        <a href="mailto:feedback@eventhub.example.com" className="text-purple-600 hover:text-purple-800">
          feedback@eventhub.example.com
        </a>
        (Please replace with a real email address).
      </p>

      {/*
        Alternatively, you could embed a contact form here if you have a backend to process it.
        For example:
        <form className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="message" name="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Send Message
            </button>
          </div>
        </form>
      */}
    </div>
  );
};

export default ContactPage;
