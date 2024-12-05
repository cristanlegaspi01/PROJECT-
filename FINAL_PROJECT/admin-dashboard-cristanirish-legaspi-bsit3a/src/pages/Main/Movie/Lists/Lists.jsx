import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/movies');
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = async (id) => {
    const isConfirm = window.confirm('Are you sure that you want to delete this movie?');
    if (isConfirm) {
      try {
        await axios.delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
       
        setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Failed to delete the movie. Please try again.');
      }
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          className="create-button"
          type="button"
          onClick={() => navigate('/main/movies/form')}
        >
          Create New
        </button>
      </div>
      <div className="table-container">
        {loading ? (
          <p>Loading movies...</p>
        ) : (
          <table className="movie-lists">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.title}</td>
                  <td>
                    <button
                      className="edit-button"
                      type="button"
                      onClick={() => navigate(`/main/movies/form/${movie.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDelete(movie.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Lists;
