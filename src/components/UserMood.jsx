/* eslint-disable react-hooks/exhaustive-deps */
import '../App.css';
import { useState, useEffect } from 'react';
import happy from '../assets/happy.png';
import happy1 from '../assets/happy1.png';
import sad from '../assets/sad.png';
import sad1 from '../assets/sad1.png';
import veryhappy from '../assets/veryhappy.png';
import veryhappy1 from '../assets/veryhappy1.png';
import verysad from '../assets/verysad.png';
import verysad1 from '../assets/verysad1.png';
import middle from '../assets/middle.png';
import middle1 from '../assets/middle1.png';
import useData from '../features/useData';

const UserMood = () => {
  const [activeMood, setActiveMood] = useState(null);
  const { updateCalendarData, getCalendarData } = useData();

  const moodPairs = [
    { normal: verysad, active: verysad1 },
    { normal: sad, active: sad1 },
    { normal: middle, active: middle1 },
    { normal: happy, active: happy1 },
    { normal: veryhappy, active: veryhappy1 },
  ];

  useEffect(() => {
    const fetchStoredMood = async () => {
      try {
        const { moodEvent } = await getCalendarData();
        console.log(moodEvent);
        if (moodEvent) {
          console.log(moodEvent);
          setActiveMood(moodEvent);
        }
      } catch (error) {
        console.error('Error fetching stored mood:', error);
      }
    };

    fetchStoredMood();
  }, []);

  const changeMood = async (moodIndex) => {
    setActiveMood(moodIndex === activeMood ? null : moodIndex);

    try {
      await updateCalendarData(
        new Date(),
        new Date(),
        { mood: moodIndex },
        'mood'
      );
      console.log('Mood updated successfully');
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  return (
    <div className='card'>
      <p>Hur mår du idag?</p>

      {moodPairs.map((mood, index) => (
        <img
          key={index}
          className='moodImg'
          src={activeMood === index ? mood.active : mood.normal}
          alt='mood emoji'
          onClick={() => changeMood(index)}
        />
      ))}
    </div>
  );
};

export default UserMood;
