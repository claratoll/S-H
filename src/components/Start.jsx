import '../App.css';
import Login from './Login';
import SignUp from './SignUp';
import useUser from '../features/useUser';
import Steps from './Steps';
import MonthlyChallenge from './MonthlyChallenge';
import UsersGoals from './UsersGoals';
import NextWorkout from './NextWorkout';
import images from '../assets/images.js';
import logo from '../assets/logo.png';
import PromotionProgram from './PromotionProgram.jsx';

const Start = () => {
  const user = useUser();

  return (
    <div>
      <img src={logo} alt='logo' />
      {user ? (
        <div>
          <p>Hej {user ? user.name : ''}</p>
          <Steps />
          <NextWorkout />
          <MonthlyChallenge />
          <UsersGoals />
        </div>
      ) : (
        <div>
          <div
            className='program card'
            style={{
              backgroundImage: `url(${images[4]})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h1>Välkommen till StrongAndHappy.se</h1>
            <p>Medlemskapet för dig som vill bli stark och ha kul samtidigt.</p>
          </div>

          <Login />
          <SignUp />
          <PromotionProgram programName='Styrka för Nybörjare' />
          <PromotionProgram programName='Högintensiv Konditionsträning' />
          <div>
            <h2>I medlemskapet ingår</h2>
            <ul>
              <li>Teknikgenomgång</li>
              <li>Passuppläggning</li>
              <li>Rimlig träningsnivå för dig</li>
              <li>Programmering över tid</li>
              <li>Privata coachingssamtal</li>
            </ul>
            <h3>
              Medlemskapet för dig som vill bli stark och ha roligt samtidigt
            </h3>
            <p>
              Du får tillgång till alla träningsprogram när du blir medlem och
              får köra igenom alla program så många gånger du vill.
            </p>
          </div>
          <div className='program card'>
            <p>
              Varmt välkommen till strongandhappy.se, medlemskapet för dig som
              vill träna för att bli stark!
            </p>

            <p>
              På strongandhappy.se hittar du träningsprogram för hemmaträning
              och gymträning, för dig som gillar att svettas mycket och för dig
              som gillar att ta i.
            </p>
            <p>
              Det är för dig som vill träna hemifrån, som vill köra pass som
              utmanar och utvecklar, samtidigt som passen är enkla att genomföra
              och inte kräver så mycket av dig.
            </p>
            <p>
              Det är för dig som vill gymma, som vill följa en enkel
              träningsprogrammering, utvecklas och jobba mot dina mål med roliga
              och effektiva träningspass.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
