import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession();

    // setUser(session?.user ?? null); // This is incorrect, getSession is async
    // setLoading(false);

    // const { data: { subscription } } = supabase.auth.onAuthStateChange(
    //   (_event, session) => {
    //     setUser(session?.user ?? null);
    //     setLoading(false);
    //   }
    // );

    // return () => {
    //   subscription?.unsubscribe();
    // };

    async function fetchSession() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (error) {
            console.error('Error fetching profile:', error);
            setUser(session.user); // Fallback to session user if profile fetch fails
          } else {
            setUser({ ...session.user, ...profile });
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Error in session fetch:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (error) {
            console.error('Error fetching profile on auth change:', error);
            setUser(session.user); // Fallback
          } else {
            setUser({ ...session.user, ...profile });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
     return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    signUp: async (data) => supabase.auth.signUp(data),
    signIn: async (data) => {
        const { error, data: sessionData } = await supabase.auth.signInWithPassword(data);
        if (error) throw error;
        if (sessionData?.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', sessionData.user.id)
                .single();
            if (profileError) throw profileError;
            setUser({ ...sessionData.user, ...profile });
            return { user: { ...sessionData.user, ...profile }, session: sessionData.session };
        }
        return sessionData;
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
    },
    user,
    loading,
    // Helper to fetch full profile if needed, e.g., after an update
    fetchUserProfile: async (userId) => {
      if (!userId) return;
      setLoading(true);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        setUser(prevUser => ({ ...prevUser, ...profile })); // Merge with existing user data
        return profile;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
