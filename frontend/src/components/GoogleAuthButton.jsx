// src/components/GoogleAuthButton.jsx
import { supabase } from '../supabaseClient';

export default function GoogleAuthButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/verify', // Or your hosted domain
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md"
    >
      Sign in with Google
    </button>
  );
}
