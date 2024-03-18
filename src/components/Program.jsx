/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import useAuthListener from '../features/useAuthListener';
import { Link } from 'react-router-dom';
import images from '../assets/images.js';
import usePremium from '../features/usePremium';
import premiumLockImg from '../assets/lock.png';
import peasantLogo from '../assets/peasant.png';
import royaltyLogo from '../assets/crownR.png';
import PremiumPayment from '../payments/PremiumPayment.jsx';

const Program = ({ program }) => {
  const [expandedBlock, setExpandedBlock] = useState(null);
  const isUserPremium = usePremium();
  const [user, setUser] = useState(null);
  const [showProgram, setShowProgram] = useState();

  useAuthListener((user) => {
    setUser(user); // Uppdatera användarstatus i komponentens tillstånd
  });

  useEffect(() => {
    if (user) {
      if (program.user === 'peasant') {
        setShowProgram(true);
      } else if (program.user === 'royalty') {
        if (isUserPremium) {
          setShowProgram(true);
        } else {
          setShowProgram(false);
        }
      } else {
        setShowProgram(false);
      }
    } else {
      // Användare är inte inloggad, så antag att de inte är premium
      setShowProgram(false);
    }
  }, [user, isUserPremium, program.user]);

  return (
    <div
      className='program card'
      style={{
        backgroundImage: `url(${images[program.id] || images[4]})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {showProgram ? (
        <>
          {program.user === 'peasant' && <img src={peasantLogo} alt='' />}
          {program.user === 'royalty' && <img src={royaltyLogo} alt='' />}

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
                block.workouts.map((workout) => (
                  <div key={workout.id}>
                    <Link
                      to={`/programs/${program.id}/${block.id}/${workout.id}`}
                      state={{ workout, programId: program.id }}
                    >
                      {workout.name}
                    </Link>
                    <br />
                  </div>
                ))}
            </div>
          ))}
        </>
      ) : (
        <>
          <img src={premiumLockImg} alt='premium' />
          <h2>{program.name}</h2>
          <h2>Bli premium för att se detta program</h2>
          <PremiumPayment />
        </>
      )}
    </div>
  );
};
export default Program;
