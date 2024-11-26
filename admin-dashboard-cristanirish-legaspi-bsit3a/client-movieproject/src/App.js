import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './pages/Main/Main';
import Home from './pages/Main/Movie/Home/Home';
import MovieContextProvider from './context/MovieContext';
import View from './pages/Main/Movie/View/View';
import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';

const router = createBrowserRouter([
  {
    path: '/',  // Login page
    element: <Login />,
  },
  {
    path: '/register',  // Register page
    element: <Register />,
  },
  {
    path: '/main',  // Main route
    element: <Main />,
    children: [
      {
        path: '',  // Home page (relative path, not '/')
        element: <Home />,
      },
      {
        path: 'view/:movieId',  // Movie view page (relative path)
        element: <View />,
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <MovieContextProvider>
        <RouterProvider router={router} />
      </MovieContextProvider>
    </div>
  );
}

export default App;
