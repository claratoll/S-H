import '../App.css';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore';

const PremiumPayment = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handlePayment = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Ingen användare inloggad');
      }

      const checkoutSessionsCollection = collection(
        db,
        'users',
        currentUser.uid,
        'checkout_sessions'
      );

      const docRef = await addDoc(checkoutSessionsCollection, {
        price: 'price_1OquA3BRe5jqCae061E0VtL0',
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

      const docSnapshot = doc(
        db,
        'users',
        currentUser.uid,
        'checkout_sessions',
        docRef.id
      );

      onSnapshot(docSnapshot, (snap) => {
        const { error, url } = snap.data();
        if (error) {
          console.error(`An error occurred: ${error.message}`);
        }
        if (url) {
          window.location.assign(url);
        }
      });
    } catch (error) {
      console.error('Oops, något gick fel!', error);
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Bli premium-medlem</button>
    </div>
  );
};

export default PremiumPayment;
