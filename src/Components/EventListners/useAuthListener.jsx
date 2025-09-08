import { useEffect } from 'react';
import axios from 'axios';

/**
 * A custom React hook that listens for Supabase authentication events.
 * When a user signs in (e.g., via Google), it sends their details to your backend.
 * @param {object} supabase - The initialized Supabase client instance.
 */
const useAuthListener = (supabase) => {
  useEffect(() => {
    // Exit if the Supabase client isn't ready
    if (!supabase) {
      console.error("Supabase client is not available. Make sure the Supabase script is loaded and initialized.");
      return;
    }

    // This listener fires whenever the user's authentication state changes (e.g., login, logout).
    // The function name is onAuthStateChange (singular), not onAuthStateChanged (plural).
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        // We trigger the sync only when a user successfully signs in.
        // This works for both social logins and email confirmations.
        if (event === 'SIGNED_IN' && session) {
          const user = session.user;
          
          const userData = {
            supabaseId: user.id,
            email: user.email,
            fullName: user.user_metadata.full_name, // Comes from Google or your sign-up form
          };

          // This is where the call to your backend happens.
          try {
            const apiUrl = 'http://localhost:3001/api/users/sync'; // Your backend endpoint
            const response = await axios.post(apiUrl, userData);
            console.log('Backend sync response:', response.data.message);
          } catch (error) {
            console.error('Error syncing user to backend:', error.response?.data?.message || error.message);
          }
        }
      }
    );

    // This cleanup function is important to prevent memory leaks when the component unmounts.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]); // The effect re-runs if the supabase client instance changes.
};

export default useAuthListener;

