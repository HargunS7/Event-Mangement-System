import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="prose max-w-none"> {/* Using Tailwind Typography for nice default styling */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      <p className="text-sm text-gray-500 italic mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

      <p>
        Welcome to EventHub ("we," "our," or "us"). We are committed to protecting your personal information
        and your right to privacy. If you have any questions or concerns about this privacy notice, or our
        practices with regards to your personal information, please contact us at privacy@eventhub.example.com
        (replace with a real contact).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">1. Information We Collect</h2>
      <p>
        We collect personal information that you voluntarily provide to us when you register on EventHub,
        express an interest in obtaining information about us or our products and services, when you participate
        in activities on EventHub (such as submitting an event request or RSVPing to an event) or otherwise
        when you contact us.
      </p>
      <p>The personal information that we collect depends on the context of your interactions with us and EventHub,
        the choices you make and the products and features you use. The personal information we collect may include
        the following:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Personal Information Provided by You:</strong> We collect names; email addresses; usernames; passwords; contact preferences; phone numbers; and other similar information.</li>
        <li><strong>Event Information:</strong> When clubs submit event requests, we collect information related to the event, such as title, description, location, date, and club name.</li>
        {/* Add more specifics as needed based on your exact data model */}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">2. How We Use Your Information</h2>
      <p>
        We use personal information collected via EventHub for a variety of business purposes described below.
        We process your personal information for these purposes in reliance on our legitimate business interests,
        in order to enter into or perform a contract with you, with your consent, and/or for compliance with
        our legal obligations.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>To facilitate account creation and logon process.</li>
        <li>To post testimonials with your consent.</li>
        <li>To manage user accounts.</li>
        <li>To send administrative information to you.</li>
        <li>To enable user-to-user communications (if applicable and with consent).</li>
        <li>To manage event requests and display event information.</li>
        <li>To protect our Services (e.g., for fraud monitoring and prevention).</li>
        <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
        {/* Add more specifics */}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">3. Will Your Information Be Shared With Anyone?</h2>
      <p>
        We only share information with your consent, to comply with laws, to provide you with services,
        to protect your rights, or to fulfill business obligations.
      </p>
      {/* Detail specific sharing practices, e.g., with service providers like Supabase, other users (if applicable) */}
      <p>
        Specifically, we may need to process your data or share your personal information in the following situations:
      </p>
       <ul className="list-disc pl-5 space-y-1">
        <li><strong>Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: data storage (Supabase), web hosting.</li>
        <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
        <li><strong>Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice.</li>
      </ul>


      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">4. How Long Do We Keep Your Information?</h2>
      <p>
        We will only keep your personal information for as long as it is necessary for the purposes set out
        in this privacy notice, unless a longer retention period is required or permitted by law (such as tax,
        accounting or other legal requirements). No purpose in this notice will require us keeping your personal
        information for longer than the period of time in which users have an account with us.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">5. How Do We Keep Your Information Safe?</h2>
      <p>
        We have implemented appropriate technical and organizational security measures designed to protect the
        security of any personal information we process. However, despite our safeguards and efforts to secure
        your information, no electronic transmission over the Internet or information storage technology can be
        guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other
        unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal,
        or modify your information.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">6. Your Privacy Rights</h2>
      <p>
        In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws.
        These may include the right (i) to request access and obtain a copy of your personal information, (ii) to
        request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv)
        if applicable, to data portability. In certain circumstances, you may also have the right to object to
        the processing of your personal information.
      </p>
      <p>
        If you wish to exercise any of these rights, please contact us at the email provided above.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">7. Updates To This Notice</h2>
      <p>
        We may update this privacy notice from time to time. The updated version will be indicated by an updated
        "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage
        you to review this privacy notice frequently to be informed of how we are protecting your information.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">8. How Can You Contact Us About This Notice?</h2>
      <p>
        If you have questions or comments about this notice, you may email us at privacy@eventhub.example.com
        (replace with a real contact) or by post to:
      </p>
      <p className="italic">
        [Your Organization Name/University Club Name]<br />
        [Your Address/University Address]<br />
        [City, State, Zip Code]
      </p>
      <p className="mt-8 text-xs text-gray-500">
        This is a template privacy policy. You should consult with a legal professional to ensure it meets all applicable legal requirements for your specific situation and jurisdiction.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
