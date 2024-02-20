import { useLocation } from 'react-router-dom';

const Workout = () => {
  const location = useLocation();
  const workout = location.state.workout;

  return (
    <div className='card'>
      <h2>{workout.name}</h2>
      {workout.exercises.map((exercise, index) => (
        <div key={index}>
          <p>{exercise.name}</p>
          <p>{exercise.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Workout;
