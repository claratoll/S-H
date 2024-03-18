import { useState } from 'react';
import { getAuth, deleteUser } from 'firebase/auth';
import app from '../firebase';
import {
  doc,
  deleteDoc,
  getFirestore,
  collection,
  getDocs,
  deleteField,
} from 'firebase/firestore';

const ManageSubscription = () => {
  const [showOptions, setShowOptions] = useState(false);

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      'Är du säker på att du vill ta bort kontot? Detta går inte att ångra.'
    );
    if (isConfirmed) {
      console.log('ta bort konto funktion ');
      const auth = getAuth(app);
      const user = auth.currentUser;
      const db = getFirestore();

      try {
        // Ta bort användaren från Firestore
        await deleteDoc(doc(db, 'users', user.uid));

        // Ta bort användaren från autentiseringen
        await deleteUser(user);
        console.log('Användaren har tagit bort sitt konto');

        //navigera till startsidan
      } catch (error) {
        console.error('Fel uppstod vid borttagning av användarkonto:', error);
        window.confirm(
          'Det gick inte att ta bort ditt konto. Kontakta info@claratoll.se så hjälper vi dig.'
        );
      }
    }
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
