import { getAuth, signOut } from 'firebase/auth';
import useUser from '../features/useUser';
import app from '../firebase';
import { useNavigate } from 'react-router-dom';
import CalendarView from './CalendarView';
import PremiumPayment from '../payments/PremiumPayment';
import ManageSubscription from '../payments/ManageSubscription';
import usePremium from '../features/usePremium';

const Profile = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const user = useUser();
  const isUserPremium = usePremium();
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
      navigate('/');
    } catch (error) {
      console.error('Fel vid utloggning:', error.message);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <h2>
            {greeting} {user ? user.name : ''}
          </h2>
          <button onClick={logOutFromFirebase}>Logga ut</button>

          <div className='card'>
            <p>din medlemskapsstatus är </p>
            {!isUserPremium ? (
              <div>
                <p>Basic</p>
                <PremiumPayment />
              </div>
            ) : (
              <div>
                <p>Premium</p>
                <ManageSubscription />
              </div>
            )}
          </div>
          <p>Hur mår du idag?</p>
          <p>Scrollview av alla aktiva träningsprogram</p>
          <CalendarView />
        </>
      ) : (
        <p>Du behöver vara inloggad för att se detta.</p>
      )}
    </div>
  );
};

export default Profile;
