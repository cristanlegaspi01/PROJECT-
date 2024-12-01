import React, { useState, useEffect } from "react";
import axios from "axios";

const Photos = ({ movieId }) => {
  const [photos, setPhotos] = useState([]);
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`/movies/${movieId}/photos`);
        setPhotos(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPhotos();
  }, [movieId]);

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/movies/${movieId}/photos`, { url: photoUrl });
      setPhotos([...photos, response.data]);
      setPhotoUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Photos for Movie ID: {movieId}</h2>
      <form onSubmit={handleAddPhoto}>
        <div>
          <label>Photo URL</label>
          <input
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Enter photo URL"
          />
        </div>
        <button type="submit">Add Photo</button>
      </form>

      <h3>Photos</h3>
      <div>
        {photos.map((photo) => (
          <img key={photo.id} src={photo.url} alt="Movie Photo" />
        ))}
      </div>
    </div>
  );
};

export default Photos;
