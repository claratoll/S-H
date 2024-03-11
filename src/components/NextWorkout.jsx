import '../App.css';
import { useState, useEffect } from 'react';
import workoutPrograms from '../assets/WorkoutPrograms.json';
import useData from '../features/useData';
import images from '../assets/images.js';
import { Link } from 'react-router-dom';

const NextWorkout = () => {
  const { getData } = useData(); //hämtar från firebase
  const [nextWorkouts, setNextWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const programId = 0;
  const blockId = 0;
  const workoutId = 0;

  const getAllWorkoutsFromFirebase = async () => {
    let tempNextWorkouts = []; // Skapar en temporär array
    for (const program of workoutPrograms) {
      let nextWorkoutFound = false;
      for (const block of program.blocks) {
        if (nextWorkoutFound) break;
        for (const workout of block.workouts) {
          const firebaseWorkout = await getData(
            program.id.toString(),
            workout.id.toString()
          );

          if (
            !firebaseWorkout ||
            (firebaseWorkout && firebaseWorkout.isActive)
          ) {
            console.log(
              'hallå Nästa träningspass är:',
              workout.name,
              workout.id
            );

            console.log('Adding workout: ', workout.name);
            tempNextWorkouts.push(workout);

            nextWorkoutFound = true;
            break;
          }
        }
      }
    }
    setNextWorkouts(tempNextWorkouts);
    setLoading(false);
  };

  useEffect(() => {
    getAllWorkoutsFromFirebase();
  }, []);

  if (loading) {
    return <p className='card'>Hämtar dina träningspass...</p>;
  }

  if (!nextWorkouts || Object.keys(nextWorkouts).length === 0) {
    return <p className='card'>Du har inga aktiva träningspass</p>;
  }

  return (
    <div className='card'>
      Ditt nästa träningspass är
      <div className='nextworkout-container'>
        {nextWorkouts.map((nextWorkout, index) => (
          <div
            key={index}
            className='nextworkout'
            style={{
              backgroundImage: `url(${images[index] || images[4]})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Link
              to={`/programs/${programId}/${blockId}/${workoutId}`}
              state={{ nextWorkout, programId: programId }}
            >
              <h3>{nextWorkout.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextWorkout;
