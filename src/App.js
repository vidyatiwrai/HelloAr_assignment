import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useSwipeable } from 'react-swipeable';

const videoIds = [
  'AshiQcL9-dg',
  'rdWMCl3BfRk',
  'NFs-F4XXlX8',
  'BOd4k5jhSw4',
  'WUc-HnOWmVQ',
  '7zitoUc_rd8',
  '9QQWvRc082o',
  'VMzPdKcNuso',
  '-ABzZmiAd-k',
  'XVAocZrNv3c',
  'KWe7gjnN4uc',
  // Add more video IDs as needed
];

const App = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState(Array(videoIds.length).fill(false));
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedUp: () => setCurrentVideoIndex((prevIndex) => Math.min(prevIndex + 1, videoIds.length - 1)),
    onSwipedDown: () => setCurrentVideoIndex((prevIndex) => Math.max(prevIndex - 1, 0)),
  });

  const handleTouchStart = (event) => {
    const startY = event.touches[0].clientY;
    event.target.addEventListener('touchend', function touchEndHandler(e) {
      const endY = e.changedTouches[0].clientY;
      handleSwipe(startY, endY);
      event.target.removeEventListener('touchend', touchEndHandler);
    });
  };

  const handleSwipe = (startY, endY) => {
    const deltaY = endY - startY;
    if (deltaY > 50 && currentVideoIndex > 0) {
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentVideoIndex < videoIds.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoIds.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const toggleLike = () => {
    setLikedVideos((prevLikedVideos) => {
      if (prevLikedVideos.includes(currentVideoIndex)) {
        return prevLikedVideos.filter((index) => index !== currentVideoIndex);
      } else {
        return [...prevLikedVideos, currentVideoIndex];
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex((prevIndex) => prevIndex - 1);
      } else if (event.key === 'ArrowDown' && currentVideoIndex < videoIds.length - 1) {
        setCurrentVideoIndex((prevIndex) => prevIndex + 1);
      } else if (event.key === ' ') {
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentVideoIndex, isPlaying]);

  return (
    <div className="app">
      <input type="text" placeholder="Search" />
      {videoIds.map((videoId, index) => (
        <div key={videoId} className="video-container">
          <iframe
            title={`YouTube Video ${index + 1}`}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
            autoPlay={index === currentVideoIndex && isPlaying}
            onTouchStart={handleTouchStart}
            {...handlers}
          ></iframe>
          <div className="video-controls">
            <button className="like-button" onClick={toggleLike}>
              {likedVideos.includes(index) ? '👍' : '👍'}
            </button>
            <button className="play-pause-button" onClick={togglePlayPause}>
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${videoProgress}%` }}></div>
            </div>
            <div className="video_title">Video Title {index + 1}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
