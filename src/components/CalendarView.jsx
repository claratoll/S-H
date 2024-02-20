import Calendar from 'react-calendar';
import useUser from '../features/useUser';
import { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import app from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const CalendarView = () => {
  const user = useUser();
  const [selectedDate, setSelectedDate] = useState(null);
  const firestore = getFirestore(app);
  const [events, setEvents] = useState([]);

  const handleDayClick = (value, event) => {
    setSelectedDate(value);
  };

  useEffect(() => {
    if (selectedDate && user) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(firestore, 'users', user.id, 'calendar'),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newEvents = [];
        querySnapshot.forEach((doc) => {
          newEvents.push(doc.data());
        });
        setEvents(newEvents);
      });

      return () => unsubscribe();
    }
  }, [selectedDate, user]);

  return (
    <div>
      <Calendar onClickDay={handleDayClick} />
      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index}>
            <p>{event.title}</p>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default CalendarView;
