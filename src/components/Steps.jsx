import '../App.css';
import { useState, useEffect } from 'react';
import useData from '../features/useData';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import arrowDown from '../assets/arrowdown.png';

const Steps = () => {
  const { getCalendarData, updateCalendarData } = useData();
  const [goalSteps, setGoalSteps] = useState(10000);
  const [todaysSteps, setTodaysSteps] = useState();
  const [editedGoalSteps, setEditedGoalSteps] = useState(goalSteps);
  const [editedTodaysSteps, setEditedTodaysSteps] = useState(todaysSteps);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    // Anropa funktionen för att hämta kalenderdata när komponenten mountas
    fetchTodaysSteps();
  }, []);

  const fetchTodaysSteps = async () => {
    const { filteredEvents, stepGoal } = await getCalendarData();
    setGoalSteps(stepGoal);

    if (filteredEvents) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysEvent = filteredEvents.find((event) => {
        const dateFromTimestamp = new Date(event.date.seconds * 1000);
        dateFromTimestamp.setHours(0, 0, 0, 0);
        return +dateFromTimestamp === +today && event.steps;
      });

      if (todaysEvent) {
        setTodaysSteps(todaysEvent.steps);
      } else {
        setTodaysSteps(0);
      }
    }
  };

  const handleEditClick = () => {
    setShowEdit(!showEdit);
    setEditedGoalSteps(goalSteps);
    setEditedTodaysSteps(todaysSteps);
  };

  const handleGoalChange = (e) => {
    const value = e.target.value;
    if (value.trim() === '' || value === '') {
      setEditedGoalSteps('');
    } else {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue)) {
        setEditedGoalSteps(intValue);
      }
    }
  };

  const handleTodaysChange = (e) => {
    const today = new Date();
    const value = e.target.value;
    if (value.trim() === '' || value === '') {
      setEditedTodaysSteps('');
    } else {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue)) {
        setEditedTodaysSteps(intValue);
        updateCalendarData(today, { steps: intValue }, 'steps');
      }
    }
  };

  const handleSaveClick = () => {
    setShowEdit(false);
    if (editedGoalSteps !== '' && editedTodaysSteps !== '') {
      setGoalSteps(editedGoalSteps);
      setTodaysSteps(editedTodaysSteps);
    }
  };

  const handleCancelClick = () => {
    setShowEdit(false);
  };

  return (
    <div className='card step'>
      <CircularProgressbar
        strokeWidth={15}
        trailWidth={5}
        styles={buildStyles({
          strokeLinecap: 'round',
          pathTransitionDuration: 0.5,
          pathColor: '#c598af',
          trailColor: '#4a1942',
        })}
        className='circleprogress'
        value={todaysSteps}
        maxValue={goalSteps}
      />
      {showEdit ? (
        <div>
          <input
            type='text'
            value={editedTodaysSteps}
            onChange={handleTodaysChange}
            pattern='\d*'
          />
          av
          <input
            type='text'
            value={editedGoalSteps}
            onChange={handleGoalChange}
          />
          <button onClick={handleSaveClick}>Spara</button>
          <button onClick={handleCancelClick}>Glöm</button>
        </div>
      ) : (
        <p>
          Dagliga steg mål: {todaysSteps} av {goalSteps}
        </p>
      )}
      <img
        src={arrowDown}
        alt='arrow down'
        className='imgarrow'
        onClick={() => handleEditClick()}
      />
    </div>
  );
};

export default Steps;
