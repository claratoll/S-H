import { getAuth } from 'firebase/auth';
import app from '../firebase';
import {
  doc,
  collection,
  getDocs,
  getFirestore,
  setDoc,
  getDoc,
} from 'firebase/firestore';

const useData = () => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const getCalendarData = async () => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return null;
    }

    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const stepGoal = userData.stepGoal;

    const collectionRef = collection(
      firestore,
      'users',
      auth.currentUser.uid,
      'calendar'
    );
    const querySnapshot = await getDocs(collectionRef);

    const filteredEvents = [];

    querySnapshot.forEach((doc) => {
      const event = doc.data();
      if (event.steps) {
        filteredEvents.push(event);
      }
    });

    return { filteredEvents, stepGoal };
  };

  const updateCalendarData = async (steps) => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const collectionRef = collection(
      firestore,
      'users',
      auth.currentUser.uid,
      'calendar'
    );
    const querySnapshot = await getDocs(collectionRef);

    let docRef;
    querySnapshot.forEach((doc) => {
      const event = doc.data();
      const dateFromTimestamp = new Date(event.date.seconds * 1000);
      dateFromTimestamp.setHours(0, 0, 0, 0);
      if (+dateFromTimestamp === +today && event.title === 'steps') {
        docRef = doc.ref;
      }
    });

    const docId = today.toISOString().split('T')[0];

    if (!docRef) {
      docRef = doc(firestore, 'users', auth.currentUser.uid, 'calendar', docId);
    }

    const calData = {
      date: today,
      steps: steps,
      title: 'steps',
    };

    await setDoc(docRef, calData, { merge: true });
  };

  const getData = async (programId, workoutId) => {
    let isActive = false;
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return null;
    }

    const activeProgram = doc(
      firestore,
      'users',
      auth.currentUser.uid,
      'programs',
      programId
    );

    const activeDocSnap = await getDoc(activeProgram);
    if (activeDocSnap.exists()) {
      const activeData = activeDocSnap.data();
      isActive = activeData.active;
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
      return { isActive };
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

  return { getCalendarData, updateCalendarData, getData, updateData };
};

export default useData;
