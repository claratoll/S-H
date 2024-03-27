/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import useAuthListener from '../features/useAuthListener';
import { Link } from 'react-router-dom';
import images from '../assets/images.js';
import usePremium from '../features/usePremium';
import peasantLogo from '../assets/peasant.png';
import royaltyLogo from '../assets/crownR.png';
import lock from '../assets/lock.png';
import PremiumPayment from '../payments/PremiumPayment.jsx';
import { useNavigate } from 'react-router-dom';

const Program = ({ program }) => {
  const [expandedBlock, setExpandedBlock] = useState(null);
  const isUserPremium = usePremium();
  const [user, setUser] = useState(null);
  const [showProgram, setShowProgram] = useState(false);
  const navigate = useNavigate();

  useAuthListener((user) => {
    setUser(user);
  });

  useEffect(() => {
    if (user) {
      if (program.user === 'peasant') {
        setShowProgram(true);
      } else if (program.user === 'royalty') {
        if (isUserPremium) {
          setShowProgram(true);
        } else {
          setShowProgram(true);
        }
      }
    } else {
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
          {program.user === 'peasant' && (
            <>
              <img src={peasantLogo} alt='peasant' />
              <h2>{program.name}</h2>
              <p>{program.description}</p>
              {program.blocks.map((block, index) => (
                <div key={index}>
                  <h3
                    onClick={() =>
                      setExpandedBlock(
                        expandedBlock === block.id ? null : block.id
                      )
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
          )}

          {program.user === 'royalty' && (
            <>
              {' '}
              {isUserPremium ? (
                <>
                  <img src={royaltyLogo} alt='royalty' />
                  <h2>{program.name}</h2>
                  <p>{program.description}</p>
                  {program.blocks.map((block, index) => (
                    <div key={index}>
                      <h3
                        onClick={() =>
                          setExpandedBlock(
                            expandedBlock === block.id ? null : block.id
                          )
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
                  <img src={royaltyLogo} alt='royalty' />
                  <h2>{program.name}</h2>
                  <h2>Bli premium för att se detta program</h2>
                  <PremiumPayment />
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <img src={lock} alt='premium' />
          <h2>{program.name}</h2>
          <h2>Bli medlem för att se detta program</h2>
          <button onClick={() => navigate('/')}>Bli medlem</button>
        </>
      )}
    </div>
  );
};
export default Program;
