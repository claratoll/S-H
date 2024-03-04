import Calendar from 'react-calendar';
import useUser from '../features/useUser';
import { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import app from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { isSameDay } from 'date-fns';

const CalendarView = () => {
  const user = useUser();
  const [selectedDate, setSelectedDate] = useState(null);
  const firestore = getFirestore(app);
  const [events, setEvents] = useState([]);
  const [selectedDateEvent, setSelectedDateEvent] = useState([]);

  const handleDayClick = (value) => {
    console.log('Selected date:', value);
    setSelectedDate(value);
  };

  const getTileClass = ({ date, view }) => {
    if (
      view === 'month' &&
      events.some((event) => isSameDay(new Date(event.date), date))
    ) {
      return 'has-event';
    }
  };

  useEffect(() => {
    if (selectedDate && events) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const selectedDateEvents = events.filter(
        (event) => event.date >= startOfDay && event.date <= endOfDay
      );

      setSelectedDateEvent(selectedDateEvents);
    }
  }, [selectedDate, events]);

  useEffect(() => {
    if (user) {
      const allEventsQuery = query(
        collection(firestore, 'users', user.uid, 'calendar')
      );

      const allEventsUnsubscribe = onSnapshot(
        allEventsQuery,
        (querySnapshot) => {
          const newEvents = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            if (data.date && typeof data.date.toDate === 'function') {
              data.date = data.date.toDate();
            }
            return data;
          });
          console.log('All events:', newEvents);
          setEvents(newEvents);
        },
        (error) => {
          console.error('Error fetching all events:', error);
        }
      );

      return () => {
        allEventsUnsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <Calendar onClickDay={handleDayClick} tileClassName={getTileClass} />
      {selectedDateEvent && selectedDateEvent.length > 0 ? (
        selectedDateEvent.map((event, index) => (
          <div key={index}>
            <p>{event.title}</p>
            {event.steps && <p>{event.steps} steg idag.</p>}
            <p>{event.info}</p>
            {event.programId && (
              <p>
                Träningsprogram: {event.programId} & pass {event.workoutId}
              </p>
            )}
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default CalendarView;
