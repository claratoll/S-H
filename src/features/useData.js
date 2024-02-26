import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const useData = () => {
  const auth = getAuth(app);

  const firestore = getFirestore(app);

  const updateData = async (programId, workoutId, data) => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return;
    }

    const dataWithDate = {
      ...data,
      date: new Date(),
    };

    console.log('usedata data:', data);
    console.log('usedata uid:', auth.currentUser.uid);
    console.log('usedata programId:', programId);
    console.log('usedata workoutId:', workoutId);
    const docRef = doc(
      firestore,
      'users',
      auth.currentUser.uid,
      'programs',
      programId,
      'workouts',
      workoutId
    );

    await setDoc(docRef, dataWithDate, { merge: true });
  };

  return { updateData };
};

export default useData;
