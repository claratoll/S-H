import Program from './Program';
import workoutPrograms from '../assets/WorkoutPrograms.json';

const AllPrograms = () => {
  return (
    <div>
      <h2>Våra program</h2>
      <p>sökfunktion</p>
      <p>Sorteringsfunktion på ex övningar, längd, kategori etc</p>
      {workoutPrograms.map((program, index) => (
        <Program key={index} program={program} />
      ))}
    </div>
  );
};

export default AllPrograms;
