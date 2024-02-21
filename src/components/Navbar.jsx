import Hamburger from './Hamburger';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <section>
      <nav className='navbar'>
        <div>
          <ul className={`ul ${hamburgerOpen ? 'open' : ''}`}>
            <div className='hamburger' onClick={toggleHamburger}>
              <Hamburger isOpen={hamburgerOpen} />
            </div>
            <li onClick={() => navigate('/programs')}>Alla program</li>
            <li onClick={() => navigate('/')}>Start</li>
            <li onClick={() => navigate('/profile')}>Profile</li>
            <li onClick={() => navigate('/')}>Sökfunktion</li>
          </ul>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
