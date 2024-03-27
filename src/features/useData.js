import { getAuth } from 'firebase/auth';
import app from '../firebase';
import {
  doc,
  collection,
  getDocs,
  getFirestore,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const useData = () => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const getChallengeData = async () => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return null;
    }

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const challengeRef = collection(firestore, 'challenge');

    const challengeQuerySnapshot = await getDocs(challengeRef);

    let challengeDoc;

    challengeQuerySnapshot.forEach((doc) => {
      const challengeData = doc.data();

      if (challengeData.year === year && challengeData.month === month) {
        challengeDoc = doc;
      }
    });

    let searchField;
    if (challengeDoc) {
      searchField = challengeDoc.data().challengeField;
    } else {
      console.error(
        'No challenge document found for the current month and year'
      );
      return null;
    }

    const collectionRef = collection(
      firestore,
      'users',
      auth.currentUser.uid,
      'calendar'
    );

    const querySnapshot = await getDocs(collectionRef);
    const workoutEvents = [];

    querySnapshot.forEach((doc) => {
      const event = doc.data();
      if (event[searchField]) {
        workoutEvents.push(event);
      }
    });

    return { workoutEvents, challengeDoc };
  };

  const getCalendarData = async () => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return null;
    }

    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const stepGoal = userData.stepGoal;
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];

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

    let moodEvent = null;

    querySnapshot.forEach((doc) => {
      const event = doc.data();
      const eventDate = event.date.toDate();
      const eventDateString = eventDate.toISOString().split('T')[0];
      if (event.mood && eventDateString === todayDateString) {
        moodEvent = event.mood;
      }
    });

    return { filteredEvents, stepGoal, moodEvent };
  };

  const deleteData = async (data) => {
    try {
      if (!auth.currentUser) {
        console.error('No user is currently signed in');
        return;
      }

      if (data.workoutId && data.programId) {
        const docRef = doc(
          firestore,
          'users',
          auth.currentUser.uid,
          'programs',
          data.programId,
          'workouts',
          data.workoutId
        );

        await deleteDoc(docRef);
        console.log('Document deleted successfully');
      }

      const collectionRef = collection(
        firestore,
        'users',
        auth.currentUser.uid,
        'calendar'
      );

      const querySnapshot = await getDocs(collectionRef);

      querySnapshot.forEach(async (doc) => {
        const eventData = doc.data();
        if (eventData.title === data.title) {
          const eventDate = eventData.date.toDate();
          eventDate.setHours(0, 0, 0, 0);
          const targetDate = new Date(data.date);
          targetDate.setHours(0, 0, 0, 0);
          if (eventDate.getTime() === targetDate.getTime()) {
            await deleteDoc(doc.ref);
            console.log('Document deleted successfully');
          }
        }
      });
    } catch (error) {
      console.error('Error deleting calendar data:', error);
    }
  };

  const updateCalendarData = async (oldDate, newDate, data, title) => {
    if (!auth.currentUser) {
      console.error('No user is currently signed in');
      return;
    }

    if (!(oldDate instanceof Date)) {
      oldDate = new Date(oldDate);
    }
    if (!(newDate instanceof Date)) {
      newDate = new Date(newDate);
    }

    oldDate.setHours(0, 0, 0, 0);

    const collectionRef = collection(
      firestore,
      'users',
      auth.currentUser.uid,
      'calendar'
    );
    const querySnapshot = await getDocs(collectionRef);

    let docRef;
    let docId;
    querySnapshot.forEach((doc) => {
      const event = doc.data();
      const dateFromTimestamp = new Date(event.date.seconds * 1000);
      dateFromTimestamp.setHours(0, 0, 0, 0);
      if (+dateFromTimestamp === +oldDate && event.title === title) {
        docRef = doc.ref;
        docId = doc.id;
      }
    });

    if (!docId) {
      docId = newDate.toISOString().split('T')[0];
    }

    if (!docRef) {
      docRef = doc(firestore, 'users', auth.currentUser.uid, 'calendar', docId);
    }

    if (!Object.prototype.hasOwnProperty.call(data, title)) {
      console.error(`Field "${title}" is missing in the data object.`);
      return;
    }

    const calData = {
      date: newDate,
      [title]: data[title],
      title: title,
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
      isActive = true;
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

  const getExerciseInfo = async (exerciseId) => {
    try {
      const exercisesRef = collection(firestore, 'exercises');
      const querySnapshot = await getDocs(exercisesRef);

      let exerciseInfo = null;
      let imageURL = null;

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        if (data.id === exerciseId) {
          exerciseInfo = data;
          if (exerciseInfo.imageLink) {
            var imageRef = ref(storage, exerciseInfo.imageLink);
            imageURL = await getDownloadURL(imageRef);
          }
          break;
        }
      }

      if (exerciseInfo) {
        return { exerciseInfo, imageURL };
      } else {
        console.error('Exercise not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting exercise info:', error);
      return null;
    }
  };

  return {
    getCalendarData,
    updateCalendarData,
    getData,
    updateData,
    getChallengeData,
    deleteData,
    getExerciseInfo,
  };
};

export default useData;
