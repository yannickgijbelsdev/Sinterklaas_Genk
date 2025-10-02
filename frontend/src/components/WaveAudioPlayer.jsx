import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const WaveAudioPlayer = ({ src, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  // Generate wave bars for visual effect
  const generateWaveBars = () => {
    const bars = [];
    for (let i = 0; i < 50; i++) {
      const height = Math.random() * 60 + 20; // Random height between 20-80%
      bars.push(height);
    }
    return bars;
  };

  const [waveBars] = useState(() => generateWaveBars());

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleWaveClick = (e) => {
    if (!audioRef.current || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`wave-audio-player ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div style={{
        background: 'linear-gradient(135deg, #FEF7ED 0%, #FEF3C7 100%)',
        borderRadius: '16px',
        padding: '20px',
        border: '2px solid #DC2626',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)'
      }}>
        {/* Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isLoading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {isPlaying ? (
              <Pause size={20} color="white" fill="white" />
            ) : (
              <Play size={20} color="white" fill="white" />
            )}
          </button>

          {/* Time Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#B91C1C',
            minWidth: '100px'
          }}>
            <span>{formatTime(currentTime)}</span>
            <span style={{ opacity: 0.6 }}>/</span>
            <span style={{ opacity: 0.8 }}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Wave Visualization */}
        <div 
          onClick={handleWaveClick}
          style={{
            position: 'relative',
            height: '80px',
            background: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #FED7D7',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'end',
            gap: '2px',
            padding: '8px 4px'
          }}
        >
          {/* Progress Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progressPercentage}%`,
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)',
              borderRadius: '8px',
              transition: 'width 0.1s ease',
              zIndex: 1
            }}
          />

          {/* Wave Bars */}
          {waveBars.map((height, index) => (
            <div
              key={index}
              style={{
                width: '6px',
                height: `${height}%`,
                background: index / waveBars.length <= progressPercentage / 100
                  ? 'linear-gradient(to top, #DC2626, #F87171)'
                  : 'linear-gradient(to top, #E5E7EB, #F3F4F6)',
                borderRadius: '3px',
                transition: 'all 0.3s ease',
                zIndex: 2,
                position: 'relative'
              }}
            />
          ))}

          {/* Loading State */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#B91C1C',
              fontSize: '14px',
              fontWeight: '600',
              zIndex: 3
            }}>
              Audio laden...
            </div>
          )}
        </div>

        {/* Progress Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          fontSize: '12px',
          color: '#B91C1C',
          opacity: 0.7
        }}>
          <span>Klik op de wave om door te spoelen</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>
    </div>
  );
};

export default WaveAudioPlayer;