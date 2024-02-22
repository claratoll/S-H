/* eslint-disable react/prop-types */

import { useState } from 'react';
import { Link } from 'react-router-dom';

const Program = ({ program }) => {
  const [expandedBlock, setExpandedBlock] = useState(null);

  return (
    <div className='program card'>
      <h2>{program.name}</h2>
      <p>{program.description}</p>
      {program.blocks.map((block, index) => (
        <div key={index}>
          <h3
            onClick={() =>
              setExpandedBlock(expandedBlock === block.id ? null : block.id)
            }
          >
            {block.name}
          </h3>
          {expandedBlock === block.id &&
            block.workouts.map((workout, index) => (
              <Link
                key={index}
                to={`/programs/${program.id}/${block.id}/${workout.id}`}
                state={{ workout }}
              >
                {workout.name}
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
};
export default Program;
