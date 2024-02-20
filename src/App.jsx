import './App.css';
import { Route, Routes } from 'react-router-dom';
import Start from './components/Start';
import AllPrograms from './components/AllPrograms';
import Program from './components/Program';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Workout from './components/Workout';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Start />}></Route>
        <Route path='/programs' element={<AllPrograms />}></Route>
        <Route path='/programs/:currentprogram' element={<Program />}></Route>
        <Route
          path='/programs/:currentprogram/:currentblock/:currentworkout'
          element={<Workout />}
        ></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
    </div>
  );
}

export default App;
