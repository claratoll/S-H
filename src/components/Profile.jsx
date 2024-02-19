import { getAuth, signOut } from 'firebase/auth';
import app from '../firebase';

const Profile = () => {
  const auth = getAuth(app);

  const logOutFromFirebase = async (event) => {
    event.preventDefault();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Fel vid utloggning:', error.message);
    }
  };

  return (
    <div>
      <button onClick={logOutFromFirebase}>Logga ut</button>
    </div>
  );
};

export default Profile;
