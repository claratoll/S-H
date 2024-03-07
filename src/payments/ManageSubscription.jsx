import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import app from '../firebase';
import { getFirestore } from 'firebase/firestore';

const ManageSubscription = () => {
  const auth = getAuth(app);

  const db = getFirestore(app);
  const [showOptions, setShowOptions] = useState(false);

  const handleDeleteAccount = () => {
    console.log('ta bort konto funktion ');
  };

  const handleSubscription = () => {
    const link = 'https://billing.stripe.com/p/login/test_5kAbIReKc3QyfFC7ss';

    window.open(link, '_blank');
  };

  const handleFirstButtonClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div>
      <button onClick={handleFirstButtonClick}>Hantera prenumeration</button>
      {showOptions && (
        <div>
          <p>
            På den här sidan kan du hantera din prenumeration, pausa eller säga
            upp själva prenumerationen. Du hittar dina kvitton och kan byta
            betalsätt.{' '}
          </p>
          <button onClick={handleSubscription}>Hantera prenumeration</button>
          <p>
            Vill du ta bort ditt konto helt och hållet så klickar du på knappen
            nedan. Då tas all data bort, och är ej återställbart.
          </p>
          <button onClick={handleDeleteAccount}>Ta bort konto</button>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription;
