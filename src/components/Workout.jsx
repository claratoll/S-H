/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useUser from '../features/useUser';
import useData from '../features/useData';
import images from '../assets/images.js';
import arrowDown from '../assets/arrowdown.png';
import addImg from '../assets/add.png';
import deleteImg from '../assets/delete.png';
import RandomWarmup from './RandomWarmup.jsx';

const Workout = () => {
  const location = useLocation();
  const { workout, programId } = location.state;
  const user = useUser();
  const { getData, updateData, getExerciseInfo } = useData();
  const [showInfo, setShowInfo] = useState(
    Array(workout.exercises.length).fill(false)
  );
  const [savedToFirebase, setSavedToFirebase] = useState('');
  const [userWorkoutInfo, setUserWorkoutInfo] = useState('');
  const [weightsValues, setWeightsValues] = useState([]);
  const [repsValues, setRepsValues] = useState([]);
  const [imageURL, setImageURL] = useState({});

  useEffect(() => {
    const exerciseInfo = async () => {
      try {
        await Promise.all(
          workout.exercises.map(async (exercise) => {
            try {
              const { imageURL } = await getExerciseInfo(exercise.id);

              console.log('link', imageURL);
              if (imageURL) {
                setImageURL((prevImages) => ({
                  ...prevImages,
                  [exercise.id]: imageURL,
                }));
              } else {
                setImageURL((prevImages) => ({
                  ...prevImages,
                  [exercise.id]: images[4],
                }));
              }
            } catch (error) {
              console.error('Error fetching exercise data:', error);
            }
          })
        );
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      }
    };

    exerciseInfo();
  }, []);

  const handleInfoClick = (index) => {
    const newShowInfo = [...showInfo];
    newShowInfo[index] = !newShowInfo[index];
    setShowInfo(newShowInfo);
  };

  const handleAddRowClick = (exerciseIndex) => {
    const newRepsValues = [...repsValues];
    const newWeightsValues = [...weightsValues];

    const lastRowIndex = newRepsValues[exerciseIndex].length - 1;
    const lastRowRepValue = newRepsValues[exerciseIndex][lastRowIndex];
    const lastRowWeightValue = newWeightsValues[exerciseIndex][lastRowIndex];

    newRepsValues[exerciseIndex].push(lastRowRepValue);
    if (newWeightsValues[exerciseIndex].length > 0) {
      newWeightsValues[exerciseIndex].push(lastRowWeightValue);
      setWeightsValues(newWeightsValues);
    }

    setRepsValues(newRepsValues);
  };

  const handleDeleteRowClick = (exerciseIndex, setIndex) => {
    const newRepsValues = [...repsValues];
    const newWeightsValues = [...weightsValues];

    newRepsValues[exerciseIndex].splice(setIndex, 1);

    if (newWeightsValues[exerciseIndex].length > 0) {
      newWeightsValues[exerciseIndex].splice(setIndex, 1);
      setWeightsValues(newWeightsValues);
    }

    setRepsValues(newRepsValues);
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

        if (data && !(Object.keys(data).length === 1 && 'isActive' in data)) {
          setUserWorkoutInfo(
            'Du har redan kört det här träningspasset en gång och du ser dina tidigare vikter och repetitioner nedan. Vill du köra det igen går det bra såklart, då uppdateras bara din gamla registrering med din nya.'
          );
          const exercisesData = Object.values(data);
          console.log('data is:', data);

          const repsValuesArray = workout.exercises.map((exercise) => {
            const exerciseData = exercisesData.find(
              (data) => data.exerciseID === exercise.id
            );

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
        } else if (data && 'isActive' in data) {
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
          <RandomWarmup initialCountdown={5} />
          <p>{userWorkoutInfo}</p>
          {workout.exercises.map((exercise, index) => {
            return (
              <div key={index} className='workoutcard'>
                <p
                  className='program card'
                  style={{
                    backgroundImage: `url(${imageURL[exercise.id]}})`,
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
                      {exercise.name}{' '}
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
                    {repsValues[index] &&
                      repsValues[index].length > 0 &&
                      repsValues[index].map((reps, setIndex) => (
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
                            )}{' '}
                          <img
                            src={deleteImg}
                            alt='delete row button'
                            className='imgarrow'
                            onClick={() =>
                              handleDeleteRowClick(index, setIndex)
                            }
                          />
                          <br />
                        </React.Fragment>
                      ))}
                  </p>
                  <img
                    src={addImg}
                    alt='add row button'
                    className='imgarrow'
                    onClick={() => handleAddRowClick(index)}
                  />
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
