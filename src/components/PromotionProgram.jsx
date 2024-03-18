/* eslint-disable react/prop-types */
import workoutPrograms from '../assets/WorkoutPrograms.json';
import { Link } from 'react-router-dom';
import images from '../assets/images.js';

const PromotionProgram = (props) => {
  const { programName } = props;
  const program = workoutPrograms.find(
    (program) => program.name === programName
  );

  if (!program) {
    return null;
  }
  const programDescription = program.description;

  return (
    <div
      className='program card'
      style={{
        backgroundImage: `url(${images[program.id]})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2>{programName}</h2>
      <p>{programDescription}</p>
      <Link to={`/programs/`}>View Program</Link>
    </div>
  );
};

export default PromotionProgram;
