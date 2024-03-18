import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkSubscription = async () => {
      if (auth.currentUser) {
        const userSubscriptionsRef = collection(
          db,
          'users',
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
      }
    };

    checkSubscription();
  }, [auth, db, auth.currentUser]);

  return isPremium;
};

export default usePremium;
