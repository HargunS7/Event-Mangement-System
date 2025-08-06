// import { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { useNavigate } from 'react-router-dom';

// export default function VerifyRedirect() {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState('Verifying your email...');

//   useEffect(() => {
//     const verifyEmail = async () => {
//       const { error } = await supabase.auth.getSessionFromUrl();

//       if (error) {
//         setMessage('❌ Invalid or expired verification link.');
//       } else {
//         setMessage('✅ Email successfully verified! Redirecting to dashboard...');
//         setTimeout(() => {
//           navigate('/dashboard'); // change to your actual landing route
//         }, 5000);
//       }
//     };

//     verifyEmail();
//   }, [navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-semibold">
//       {message}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function VerifyRedirect() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your login...');

  useEffect(() => {
    const handleRedirect = async () => {
      // 1. Handle email verification (if this is an email signup)
      await supabase.auth.exchangeCodeForSession(); // Ignore error for now

      // 2. Get current session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session || error) {
        setMessage('❌ Verification failed or session not found.');
        return;
      }

      const user = session.user;

      // 3. Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.username) {
        setMessage('👋 Welcome! Let’s complete your profile...');
        setTimeout(() => {
          navigate('/complete-profile');
        }, 2500);
      } else {
        setMessage('✅ Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard'); // Or wherever you want
        }, 2000);
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-semibold">
      {message}
    </div>
  );
}
