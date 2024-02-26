import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const useUser = () => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(firestore, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.log('No such document!');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    return onAuthStateChanged(auth, fetchUser);
  }, [auth, auth.currentUser, firestore]);

  return user;
};

export default useUser;
