import React from 'react';
import { Outlet } from 'react-router-dom';
import './Movie.css'; 

const Movie = () => {
  return (
    <>
      <h1 className="movie-title">Movie Page</h1>
      <Outlet />
    </>
  );
};

export default Movie;
