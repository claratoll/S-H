import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useAuthListener = (callback) => {
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      callback(user);
    });

    return () => unsubscribe();
  }, [auth, callback]);
};

export default useAuthListener;
