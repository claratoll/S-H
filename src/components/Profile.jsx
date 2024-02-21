import { getAuth, signOut } from 'firebase/auth';
import useUser from '../features/useUser';
import app from '../firebase';
import CalendarView from './CalendarView';

const Profile = () => {
  const auth = getAuth(app);
  const user = useUser();

  const currentTime = new Date().getHours();
  let greeting;

  if (currentTime >= 6 && currentTime < 12) {
    greeting = 'God morgon';
  } else if (currentTime >= 12 && currentTime < 18) {
    greeting = 'God dag';
  } else if (currentTime >= 18 && currentTime < 22) {
    greeting = 'God kväll';
  } else {
    greeting = 'God natt';
  }

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
      <h2>
        {greeting} {user ? user.name : ''}
      </h2>
      <button onClick={logOutFromFirebase}>Logga ut</button>
      <p className='card'>Hur mår du idag?</p>
      <p className='card'>Scrollview av alla aktiva träningsprogram</p>
      <CalendarView />
    </div>
  );
};

export default Profile;
