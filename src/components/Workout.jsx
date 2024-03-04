import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useUser from '../features/useUser';
import useData from '../features/useData';
import images from '../assets/images.js';
import arrowDown from '../assets/arrowdown.png';

const Workout = () => {
  const location = useLocation();
  const { workout, programId } = location.state;
  const user = useUser();
  const { getData, updateData } = useData();
  const [showInfo, setShowInfo] = useState(
    Array(workout.exercises.length).fill(false)
  );
  const [savedToFirebase, setSavedToFirebase] = useState('');
  const [userWorkoutInfo, setUserWorkoutInfo] = useState('');
  const [weightsValues, setWeightsValues] = useState([]);
  const [repsValues, setRepsValues] = useState([]);

  const handleInfoClick = (index) => {
    const newShowInfo = [...showInfo];
    newShowInfo[index] = !newShowInfo[index];
    setShowInfo(newShowInfo);
  };

  const handleInputChange = (exerciseIndex, setIndex, event) => {
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
        workout.name,
        exercisesData
      );

      setSavedToFirebase('Träningspass sparat, bra jobbat!');
    } catch (error) {
      console.error('Fel vid uppdatering av data:', error);
    }
  };

  useEffect(() => {
    const getFbWorkoutData = async () => {
      try {
        const data = await getData(programId.toString(), workout.id.toString());

        if (data) {
          setUserWorkoutInfo(
            'Du har redan kört det här träningspasset en gång och du ser dina tidigare vikter och repetitioner nedan. Vill du köra det igen går det bra såklart, då uppdateras bara din gamla registrering med din nya.'
          );
          const exercisesData = Object.values(data);
          console.log('data is:', data);

          // För varje övning, hämta repetitions- och viktvärden
          const repsValuesArray = workout.exercises.map((exercise) => {
            // Kontrollera om det finns data för den här övningen
            const exerciseData = exercisesData.find(
              (data) => data.exerciseID === exercise.id
            );

            // Om det finns data, använd den, annars använd defaultvärden
            if (exerciseData) {
              return exerciseData.repetitions.map((rep) => Number(rep));
            } else {
              return Array(exercise.repetitions.length).fill(0);
            }
          });

          const weightsValuesArray = workout.exercises.map((exercise) => {
            const exerciseData = exercisesData.find(
              (data) => data.exerciseID === exercise.id
            );

            if (exerciseData && exerciseData.weights) {
              return exerciseData.weights.map((weight) => Number(weight));
            } else {
              return Array(exercise.weights.length).fill(0);
            }
          });

          setRepsValues(repsValuesArray);
          setWeightsValues(weightsValuesArray);
        } else {
          const exerciseRepsValues = workout.exercises.map((exercise) =>
            Array(exercise.repetitions.length)
              .fill(0)
              .map((_, setIndex) => Number(exercise.repetitions[setIndex]))
          );
          const exerciseWeightsValues = workout.exercises.map((exercise) =>
            exercise.weights && exercise.weights.length > 0
              ? Array(exercise.weights.length)
                  .fill(0)
                  .map((_, setIndex) => Number(exercise.weights[setIndex]))
              : []
          );
          setRepsValues(exerciseRepsValues);
          setWeightsValues(exerciseWeightsValues);
        }
      } catch (error) {
        console.error('Fel vid hämtning av data:', error);
      }
    };

    getFbWorkoutData();
  }, []);

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
                    {repsValues[index].map((reps, setIndex) => (
                      <React.Fragment key={setIndex}>
                        <input
                          type='number'
                          key={`reps_${exercise.id}_${setIndex}`}
                          name={`reps_${exercise.id}_${setIndex}`}
                          value={
                            repsValues[index] && repsValues[index][setIndex]
                              ? repsValues[index][setIndex] || ''
                              : ''
                          }
                          onChange={(event) =>
                            handleInputChange(index, setIndex, event)
                          }
                        />{' '}
                        {weightsValues[index] &&
                          !weightsValues[index].every(
                            (weight) => weight === 0
                          ) && (
                            <React.Fragment>
                              x{' '}
                              <input
                                type='number'
                                key={`weight_${exercise.id}_${setIndex}`}
                                name={`weight_${exercise.id}_${setIndex}`}
                                value={
                                  weightsValues[index] &&
                                  weightsValues[index][setIndex]
                                    ? weightsValues[index][setIndex] || ''
                                    : ''
                                }
                                onChange={(event) =>
                                  handleInputChange(index, setIndex, event)
                                }
                              />{' '}
                              kg
                            </React.Fragment>
                          )}
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
