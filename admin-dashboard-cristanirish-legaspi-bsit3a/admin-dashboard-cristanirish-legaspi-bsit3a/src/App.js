import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';
import CastAndCrew from './pages/Main/Movie/Form/Cast/Cast';
import Photos from './pages/Main/Movie/Form/Photos/Photos';
import Videos from './pages/Main/Movie/Form/Videos/Videos';
import Review from './pages/Main/Movie/Form/Review';  // Ensure Review is correctly imported

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/Register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/dashboard',
        element: <Dashboard />,
      },
      {
        // Updated to capture movieId dynamically
        path: '/main/movies/form/review/',  
        element: <Review />,  // Review route now expects a movieId
      },
      {
        path: '/main/movies/form/:movieId/cast-and-crews',
        element: <CastAndCrew />,
      },
      {
        path: '/main/movies/form/:movieId/photos',
        element: <Photos />,
      },
      {
        path: '/main/movies/form/:movieId/videos',
        element: <Videos />,
      },
      {
        path: '/main/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?',
            element: <Form />,
            children: [],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
