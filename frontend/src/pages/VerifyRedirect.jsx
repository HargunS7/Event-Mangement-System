import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function VerifyRedirect() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const { error } = await supabase.auth.getSessionFromUrl();

      if (error) {
        setMessage('❌ Invalid or expired verification link.');
      } else {
        setMessage('✅ Email successfully verified! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard'); // change to your actual landing route
        }, 5000);
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-semibold">
      {message}
    </div>
  );
}
