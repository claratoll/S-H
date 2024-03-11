/* eslint-disable react/prop-types */
import workoutPrograms from '../assets/WorkoutPrograms.json';

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
    <div className='workoutcard'>
      <h2>{programName}</h2>
      <p>{programDescription}</p>
      <img src={images[program.id]} alt='Bild nummer 12' />
    </div>
  );
};

export default PromotionProgram;
