import React, { useState, useEffect } from "react";
import axios from "axios";

const Videos = ({ movieId }) => {
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/movies/${movieId}/videos`);
        setVideos(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideos();
  }, [movieId]);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/movies/${movieId}/videos`, { url: videoUrl });
      setVideos([...videos, response.data]);
      setVideoUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Videos for Movie ID: {movieId}</h2>
      <form onSubmit={handleAddVideo}>
        <div>
          <label>Video URL</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
          />
        </div>
        <button type="submit">Add Video</button>
      </form>

      <h3>Videos</h3>
      <div>
        {videos.map((video) => (
          <video key={video.id} controls>
            <source src={video.url} />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    </div>
  );
};

export default Videos;
