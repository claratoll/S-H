import '../App.css';
import Login from './Login';
import SignUp from './SignUp';
import useUser from '../features/useUser';
import Steps from './Steps';
import MonthlyChallenge from './MonthlyChallenge';
import UsersGoals from './UsersGoals';
import NextWorkout from './NextWorkout';

const Start = () => {
  const user = useUser();

  return (
    <div>
      <p>Det här är startsidan</p>

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
          <Login />
          <SignUp />
        </div>
      )}
    </div>
  );
};

export default Start;
