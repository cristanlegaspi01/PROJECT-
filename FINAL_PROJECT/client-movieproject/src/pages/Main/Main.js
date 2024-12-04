import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');  // Remove access token
    navigate('/');  // Redirect to login page after logging out
  };

  useEffect(() => {
    // If no access token, redirect to login page
    if (!accessToken) {
      navigate('/');  // Redirect to login if not authenticated
    }
  }, [accessToken, navigate]);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              {/* When clicking "Movies", navigate to the home page */}
              <a onClick={() => navigate('/home')}>Movies</a>
            </li>
            {accessToken ? (
              <li className='logout'>
                <button className='logout-btn' onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => navigate('/')}>Login</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet /> {/* This will render the nested route components */}
        </div>
      </div>
    </div>
  );
}

export default Main;
