import { useLocation } from 'react-router-dom';
import useUser from '../features/useUser';

const Workout = () => {
  const location = useLocation();
  const workout = location.state.workout;
  const user = useUser();

  return (
    <div className='card'>
      <h2>{workout.name}</h2>
      {user ? (
        <>
          {workout.exercises.map((exercise, index) => (
            <div key={index}>
              <p>{exercise.name}</p>
              <p>{exercise.description}</p>
            </div>
          ))}
        </>
      ) : (
        <p>Du behöver vara inloggad för att se detta.</p>
      )}
    </div>
  );
};

export default Workout;
