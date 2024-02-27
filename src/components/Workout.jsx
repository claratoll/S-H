import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useUser from '../features/useUser';
import useData from '../features/useData';
import images from '../assets/images.js';
import arrowDown from '../assets/arrowdown.png';

const Workout = () => {
  const location = useLocation();
  const { workout, programId } = location.state;
  const user = useUser();
  const { updateData } = useData();
  const [showInfo, setShowInfo] = useState(
    Array(workout.exercises.length).fill(false)
  );
  const [savedToFirebase, setSavedToFirebase] = useState('');
  const [userWorkoutInfo, setUserWorkoutInfo] = useState('');
  const [weightsValues, setWeightsValues] = useState(
    workout.exercises.map((exercise) => Array(exercise.sets).fill(0))
  );
  const [repsValues, setRepsValues] = useState(
    workout.exercises.map((exercise) =>
      Array(exercise.sets).fill(exercise.repetitions)
    )
  );

  const handleInfoClick = (index) => {
    const newShowInfo = [...showInfo];
    newShowInfo[index] = !newShowInfo[index];
    setShowInfo(newShowInfo);
  };

  const handleRepsChange = (exerciseIndex, setIndex, event) => {
    const { name, value } = event.target;
    const newValue = Number(value);

    if (name.startsWith('reps')) {
      const newRepsValues = [...repsValues];
      newRepsValues[exerciseIndex][setIndex] = newValue;
      setRepsValues(newRepsValues);
    } else if (name.startsWith('weight')) {
      const newWeightsValues = [...weightsValues];
      newWeightsValues[exerciseIndex][setIndex] = newValue;
      setWeightsValues(newWeightsValues);
    }
  };

  const handleUpdateData = async () => {
    try {
      const exercisesData = repsValues.map((exerciseReps, index) => ({
        exerciseID: workout.exercises[index].id,
        repetitions: exerciseReps,
        weights: weightsValues[index],
      }));

      await updateData(
        programId.toString(),
        workout.id.toString(),
        exercisesData
      );

      setSavedToFirebase('Träningspass sparat, bra jobbat!');
    } catch (error) {
      console.error('Fel vid uppdatering av data:', error);
    }
  };

  return (
    <div>
      <h2>{workout.name}</h2>
      {user ? (
        <>
          <p>{userWorkoutInfo}</p>
          {workout.exercises.map((exercise, index) => {
            return (
              <div key={index} className='workoutcard'>
                <p
                  className='program card'
                  style={{
                    backgroundImage: `url(${images[exercise.id] || images[4]})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {exercise.name}
                </p>
                <div className='instruction'>
                  <div>
                    <p>
                      {exercise.name}
                      <img
                        src={arrowDown}
                        alt='arrow down'
                        className='imgarrow'
                        onClick={() => handleInfoClick(index)}
                      />
                    </p>
                  </div>
                  {showInfo[index] && <p>{exercise.description}</p>}
                  <p>
                    Antal repetitioner:
                    <br />
                    {[...Array(exercise.sets)].map((_, setIndex) => (
                      <React.Fragment key={setIndex}>
                        <input
                          type='number'
                          name={`reps_${exercise.id}_${setIndex}`}
                          value={repsValues[index][setIndex] || ''}
                          onChange={(event) =>
                            handleRepsChange(index, setIndex, event)
                          }
                        />{' '}
                        x{' '}
                        <input
                          type='number'
                          name={`weight_${exercise.id}_${setIndex}`}
                          value={weightsValues[index][setIndex] || ''}
                          onChange={(event) =>
                            handleRepsChange(index, setIndex, event)
                          }
                        />{' '}
                        kg
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            );
          })}
          <button onClick={handleUpdateData}>Done</button>
          <p>{savedToFirebase}</p>
        </>
      ) : (
        <p>Du behöver vara inloggad för att se detta.</p>
      )}
    </div>
  );
};

export default Workout;
