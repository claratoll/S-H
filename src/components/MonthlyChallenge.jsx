/* eslint-disable react-hooks/exhaustive-deps */
import '../App.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect } from 'react';
import useData from '../features/useData';

const MonthlyChallenge = () => {
  const [loading, setLoading] = useState(true);
  const { getChallengeData } = useData();
  const [monthlyGoalNumber, setMonthlyGoalNumber] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [monthlyChallenge, setMonthlyChallenge] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      const { workoutEvents, challengeDoc } = await getChallengeData();

      const workoutNumbers = workoutEvents.length;
      console.log(workoutNumbers);
      setCurrentNumber(workoutNumbers);

      if (challengeDoc) {
        const challengeData = challengeDoc.data();
        setMonthlyGoalNumber(challengeData.challengeNumber);
        setMonthlyChallenge(challengeData.title);
        setDescription(challengeData.description);
      } else {
        console.error('Ingen utmaningsdata hämtades');
      }
      setLoading(false);
    };
    fetchChallenges();
  }, []);

  if (loading) {
    return <p className='card'>Hämtar utmaningsdata...</p>;
  }

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
        value={currentNumber}
        maxValue={monthlyGoalNumber}
        text={`${currentNumber}`}
      />
      <div>
        <p> Månadens utmaning är </p>
        <h3>{monthlyChallenge} </h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default MonthlyChallenge;
