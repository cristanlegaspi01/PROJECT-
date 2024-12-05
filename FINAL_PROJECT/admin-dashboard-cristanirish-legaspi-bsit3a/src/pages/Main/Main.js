import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
  }, [accessToken]);

 
  const movieFormMatch = location.pathname.match(/\/main\/movies\/form\/(\d+)/);
  const movieId = movieFormMatch ? movieFormMatch[1] : null;

  return (
    <div className="Main">
      <div className="container">
        <div className="navigation">
          <ul>
            {}
            <li>
              <a href="/main/dashboard">Dashboard</a>
            </li>
            {}
            <li>
              <a href="/main/movies">Movies</a>
            </li>
            {}
            {}
            <li className="logout">
              <button onClick={handleLogout} className="link-button">
                Logout
              </button>
            </li>
          </ul>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
