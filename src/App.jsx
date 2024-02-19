import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Profile from './components/Profile';

function App() {
  const auth = getAuth(app);
  const [userName, setUserName] = useState(null);
  const firestore = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
        } else {
          console.log('No such document!');
          setUserName(null);
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return (
    <div>
      {userName ? (
        <div>
          <p>Hej {userName}</p>
          <Profile />
        </div>
      ) : (
        <div>
          <Login />
          <SignUp />
        </div>
      )}
    </div>
  );
}

export default App;
