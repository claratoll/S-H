import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebase';

const SignUp = () => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [showForm, setShowForm] = useState(false);

  const createUserOnFirebase = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const name = event.target.elements.name.value;
    const username = event.target.elements.username.value;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        username: username,
        name: name,
        email: email,
        uid: user.uid,
        documentId: user.uid,
      });
    } catch (error) {
      console.error('Fel vid skapande av användare:', error.message);
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Göm skapa användare' : 'Skapa användare'}
      </button>
      {showForm && (
        <form onSubmit={createUserOnFirebase}>
          <div>
            <label htmlFor='username'>Username</label>
            <input type='text' name='username' id='username' required />
          </div>
          <div>
            <label htmlFor='name'>Name</label>
            <input type='text' name='name' id='name' required />
          </div>
          <div>
            <label htmlFor='SUemail'>Email</label>
            <input type='email' name='email' id='SUemail' required />
          </div>
          <div>
            <label htmlFor='SUpassword'>Password</label>
            <input
              type='password'
              name='password'
              id='SUpassword'
              minLength='6'
              required
            />
          </div>
          <button type='submit'>Skapa användare</button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
