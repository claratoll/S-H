import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useAuthListener = (callback) => {
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Användaren är antingen inloggad (user !== null) eller utloggad (user === null)
      callback(user);
    });

    // Avbryt lyssnaren när komponenten avmonteras
    return () => unsubscribe();
  }, [auth, callback]);
};

export default useAuthListener;
