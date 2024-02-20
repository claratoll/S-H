import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase';

const Login = () => {
  const auth = getAuth(app);
  const [showForm, setShowForm] = useState(false);

  const loginWithFirebase = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Fel vid inloggning:', error.message);
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Göm logga in' : 'Logga in'}
      </button>
      {showForm && (
        <form onSubmit={loginWithFirebase}>
          <div>
            <label htmlFor='email'>Email</label>
            <input type='text' name='email' id='email' required />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' id='password' required />
          </div>
          <button type='submit'>Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
