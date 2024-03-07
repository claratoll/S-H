import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkSubscription = async () => {
      const userSubscriptionsRef = collection(
        db,
        'customers',
        auth.currentUser.uid,
        'subscriptions'
      );
      const userSubscriptionsSnapshot = await getDocs(userSubscriptionsRef);

      userSubscriptionsSnapshot.forEach((doc) => {
        const subscription = doc.data();
        if (subscription.status === 'active') {
          setIsPremium(true);
        }
      });
    };

    checkSubscription();
  }, [auth, db]);

  return isPremium;
};

export default usePremium;
