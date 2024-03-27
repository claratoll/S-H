/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import images from '../assets/images.js';

const RandomWarmup = ({ initialCountdown }) => {
  const [countdown, setCountdown] = useState(initialCountdown);
  const [randomValue, setRandomValue] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [isWarmupStarted, setIsWarmupStarted] = useState(false);
  const [warmupTime, setWarmupTime] = useState(initialCountdown);
  const [completedWarmupExercises, setCompletedWarmupExercises] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const storage = getStorage(app);

  let timer;

  useEffect(() => {
    if (isWarmupStarted) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            clearInterval(timer);
            setTimeUp(true);

            return 0;
          }
        });
      }, 1000);
      generateRandomValue();
    }
    return () => clearInterval(timer);
  }, [isWarmupStarted]);

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(timer);
      setIsWarmupStarted(false);
    }
  }, [countdown]);

  const generateRandomValue = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setRandomValue(newValue);
    listAll(ref(storage, 'mobility'))
      .then((res) => {
        const randomIndex = Math.floor(Math.random() * res.items.length);
        getDownloadURL(res.items[randomIndex]).then((url) => {
          setImageIndex(url);
        });
      })
      .catch((error) => {
        console.error('Error getting images from Firebase Storage:', error);
      });
  };

  const handleStartWarmup = () => {
    setIsWarmupStarted(true);
    setCountdown(warmupTime * 60);
    generateRandomValue();
  };

  const handleSkip = () => {
    generateRandomValue();
  };

  const handleDone = () => {
    generateRandomValue();
    setCompletedWarmupExercises(completedWarmupExercises + 1);
  };

  const handleTimeChange = (e) => {
    const newTime = parseInt(e.target.value, 10);
    setWarmupTime(newTime);
    if (!isWarmupStarted) {
      setCountdown(newTime * 60);
    }
  };

  const handleRestart = () => {
    console.log('Restarting...');
    setCountdown(warmupTime * 60);
    setIsWarmupStarted(true);
    setTimeUp(false);
    setCompletedWarmupExercises(0);
    generateRandomValue();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='card'>
      {!timeUp ? (
        !isWarmupStarted ? (
          <>
            <button onClick={handleStartWarmup}>Starta uppvärmning</button>
            <br />
            <input
              type='number'
              value={warmupTime}
              onChange={handleTimeChange}
              disabled={isWarmupStarted}
            />{' '}
            minuter
          </>
        ) : (
          <>
            <p>Time left: {formatTime(countdown)} </p>
            <img
              src={imageIndex || images[4]}
              alt='warmup exercise image'
              style={{ maxHeight: '200px' }}
            />

            <p>Antal repetitioner: {randomValue}</p>
            <button onClick={handleSkip}>Skip</button>
            <button onClick={handleDone}>Done</button>
            {completedWarmupExercises > 0 && (
              <p>
                Du har gjort {completedWarmupExercises} uppvärmningsövningar.
              </p>
            )}
          </>
        )
      ) : (
        <>
          <button onClick={handleRestart}>Kör igen</button>
          {completedWarmupExercises > 0 && (
            <p>Du har gjort {completedWarmupExercises} uppvärmningsövningar.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RandomWarmup;
