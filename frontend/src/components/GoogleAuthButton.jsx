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
    // <button
    //   onClick={handleGoogleLogin}
    //   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md"
    // >
    //   Sign in with Google
    // </button>
    <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3 border border-gray-300 px-4 py-2 rounded-lg shadow hover:shadow-md bg-white text-gray-700 hover:bg-gray-50 transition-all duration-150"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Continue with Google
</button>

  );
}
