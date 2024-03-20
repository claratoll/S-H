import { getAuth, signOut, deleteUser } from 'firebase/auth';
import useUser from '../features/useUser';
import app from '../firebase';
import { useNavigate } from 'react-router-dom';
import CalendarView from './CalendarView';
import NextWorkout from './NextWorkout';
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

  if (currentTime >= 6 && currentTime < 10) {
    greeting = 'God morgon';
  } else if (currentTime >= 10 && currentTime < 18) {
    greeting = 'God dag';
  } else if (currentTime >= 18 && currentTime < 22) {
    greeting = 'God kväll';
  } else {
    greeting = 'God natt';
  }

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      'Är du säker på att du vill ta bort kontot? Detta går inte att ångra.'
    );
    if (isConfirmed) {
      console.log('ta bort konto funktion ');
      const auth = getAuth(app);
      const user = auth.currentUser;

      try {
        await deleteUser(user);
        console.log('Användaren har tagit bort sitt konto');
        navigate('/');

        //navigera till startsidan
      } catch (error) {
        console.error('Fel uppstod vid borttagning av användarkonto:', error);
        window.confirm(
          'Det gick inte att ta bort ditt konto. Kontakta info@claratoll.se så hjälper vi dig.'
        );
      }
    }
  };

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
    <div className='backgroundImg'>
      {user ? (
        <>
          <div className='card'>
            <h2>
              {greeting} {user ? user.name : ''}
            </h2>

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
          <p className='card'>Hur mår du idag?</p>
          <NextWorkout />
          <CalendarView />
          <div className='card'>
            <button onClick={logOutFromFirebase}>Logga ut</button>
            <p>
              Vill du ta bort ditt konto helt och hållet så klickar du på
              knappen nedan. Då tas all data bort, din eventuella prenumeration
              avbryts och det är ej återställbart.
            </p>

            <button onClick={handleDeleteAccount}>Ta bort konto</button>
          </div>
        </>
      ) : (
        <p className='card'>Du behöver vara inloggad för att se detta.</p>
      )}
    </div>
  );
};

export default Profile;
