import '../App.css';
import Login from './Login';
import SignUp from './SignUp';
import useUser from '../features/useUser';

const Start = () => {
  const user = useUser();

  return (
    <div>
      <p>Det här är startsidan</p>

      {user ? (
        <div>
          <p>Hej {user ? user.name : ''}</p>
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
