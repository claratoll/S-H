import Calendar from 'react-calendar';
import useUser from '../features/useUser';
import { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import useData from '../features/useData';
import app from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { isSameDay } from 'date-fns';
import arrowDown from '../assets/arrowdown.png';

const CalendarView = () => {
  const { updateCalendarData, deleteData } = useData();
  const user = useUser();
  const [selectedDate, setSelectedDate] = useState(null);
  const firestore = getFirestore(app);
  const [events, setEvents] = useState([]);
  const [selectedDateEvent, setSelectedDateEvent] = useState([]);
  const [isEditing, setIsEditing] = useState([]);

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

  const handleEditClick = (index) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = !newIsEditing[index];
    setIsEditing(newIsEditing);
  };

  useEffect(() => {
    setIsEditing(Array(events.length).fill(false));
  }, [events]);

  const handleDelete = async (index) => {
    const eventData = selectedDateEvent[index];
    console.log(eventData);
    await deleteData(eventData);

    setIsEditing((prevIsEditing) => {
      const newIsEditing = [...prevIsEditing];
      newIsEditing[index] = !newIsEditing[index];
      return newIsEditing;
    });
  };

  const handleInputChange = (e, value, index) => {
    const newValue = e.target.value;
    const newEvents = [...selectedDateEvent];
    newEvents[index] = { ...newEvents[index], [e.target.name]: newValue };
    setSelectedDateEvent(newEvents);
  };

  const handleSaveClick = async (index) => {
    const eventData = selectedDateEvent[index];

    await updateCalendarData(
      selectedDate,
      eventData.date,
      eventData,
      eventData.title
    );
    setIsEditing((prevIsEditing) => {
      const newIsEditing = [...prevIsEditing];
      newIsEditing[index] = !newIsEditing[index];
      return newIsEditing;
    });
  };

  return (
    <div>
      <Calendar onClickDay={handleDayClick} tileClassName={getTileClass} />
      {selectedDateEvent && selectedDateEvent.length > 0 ? (
        selectedDateEvent.map((event, index) => (
          <div key={index} className='card'>
            <p>{event.title}</p>
            {event.steps && <p>{event.steps} steg idag.</p>}
            <p>{event.info}</p>
            {event.programId && (
              <p>
                Träningsprogram: {event.programId} & pass {event.workoutId}
              </p>
            )}
            <img
              src={arrowDown}
              alt='arrow down'
              className='imgarrow'
              onClick={() => handleEditClick(index)}
            />

            {isEditing[index] && (
              <div>
                <p>
                  Här kan du ändra sparad passinformation och även ta bort din
                  sparade passinformation helt från databasen. Om du gör det och
                  sen ångrar dig behöver du gå tillbaka in på program och lägga
                  till passet från början.
                </p>
                {event.title && (
                  <p>
                    Ändra passtitel:{' '}
                    <input
                      type='text'
                      value={event.title}
                      name='title'
                      onChange={(e) => handleInputChange(e, event.title, index)}
                    />
                  </p>
                )}
                {event.date && (
                  <p>
                    Flytta till en annan dag:{' '}
                    <input
                      type='date'
                      value={event.date}
                      name='date'
                      onChange={(e) => handleInputChange(e, event.date, index)}
                    />
                  </p>
                )}
                {event.steps && (
                  <p>
                    Dagens steg:{' '}
                    <input
                      type='number'
                      value={event.steps}
                      name='steps'
                      onChange={(e) => handleInputChange(e, event.steps, index)}
                    />
                  </p>
                )}
                <button onClick={() => handleDelete(index)}>delete</button>{' '}
                <button onClick={() => handleSaveClick(index)}>save</button>
              </div>
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
