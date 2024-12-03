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
import Review from './pages/Main/Movie/Form/Review'; // Review Component Import

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'movies/form/:movieId/review', // Dynamic movieId route
        element: <Review />,
      },
      {
        path: 'movies/form/:movieId/cast-and-crews',
        element: <CastAndCrew />,
      },
      {
        path: 'movies/form/:movieId/photos',
        element: <Photos />,
      },
      {
        path: 'movies/form/:movieId/videos',
        element: <Videos />,
      },
      {
        path: 'movies',
        element: <Movie />,
        children: [
          {
            path: '',
            element: <Lists />,
          },
          {
            path: 'form/:movieId?',
            element: <Form />,
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
