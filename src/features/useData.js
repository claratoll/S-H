import { getAuth } from 'firebase/auth';
import app from '../firebase';
import { doc, getFirestore, setDoc, getDoc } from 'firebase/firestore';

const useData = () => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const getData = async (programId, workoutId) => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return null;
    }

    const docRef = doc(
      firestore,
      'users',
      auth.currentUser.uid,
      'programs',
      programId,
      'workouts',
      workoutId
    );

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  };

  const updateData = async (programId, workoutId, name, data) => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return;
    }

    const dataWithDate = {
      ...data,
      date: new Date(),
    };

    const docId = `${programId}-workouts-${workoutId}`;

    const docRef = doc(
      firestore,
      'users',
      auth.currentUser.uid,
      'programs',
      programId,
      'workouts',
      workoutId
    );

    const saveToCalendarDocRef = doc(
      firestore,
      'users',
      auth.currentUser.uid,
      'calendar',
      docId
    );

    const calendarData = {
      date: new Date(),
      workoutId: workoutId,
      programId: programId,
      title: name,
    };

    await setDoc(docRef, dataWithDate, { merge: true });
    await setDoc(saveToCalendarDocRef, calendarData, { merge: true });
  };

  return { getData, updateData };
};

export default useData;
