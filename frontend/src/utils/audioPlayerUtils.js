// Utility functions for custom wave audio player
export const initializeAudioPlayers = () => {
  // Initialize all audio players on the page
  document.querySelectorAll('.wave-audio-container').forEach(container => {
    const audio = container.querySelector('.hidden-audio');
    const playBtn = container.querySelector('.audio-play-btn');
    const currentTimeEl = container.querySelector('.current-time');
    const totalTimeEl = container.querySelector('.total-time');
    const waveContainer = container.querySelector('.wave-container');
    const waveProgress = container.querySelector('.wave-progress');
    const progressPercentageEl = container.querySelector('.progress-percentage');
    const waveBars = container.querySelectorAll('.wave-container > div:not(.wave-progress)');

    if (!audio || !playBtn) return;

    let isPlaying = false;
    let duration = 0;

    // Format time helper
    const formatTime = (time) => {
      if (isNaN(time)) return '0:00';
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Update wave bars based on progress
    const updateWaveBars = (progress) => {
      waveBars.forEach((bar, index) => {
        const barProgress = index / waveBars.length;
        if (barProgress <= progress) {
          bar.style.background = 'linear-gradient(to top, #DC2626, #F87171)';
        } else {
          bar.style.background = 'linear-gradient(to top, #E5E7EB, #F3F4F6)';
        }
      });
    };

    // Audio event listeners
    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
      totalTimeEl.textContent = formatTime(duration);
    });

    audio.addEventListener('timeupdate', () => {
      const currentTime = audio.currentTime;
      const progress = duration > 0 ? (currentTime / duration) : 0;
      
      currentTimeEl.textContent = formatTime(currentTime);
      waveProgress.style.width = `${progress * 100}%`;
      progressPercentageEl.textContent = `${Math.round(progress * 100)}%`;
      
      updateWaveBars(progress);
    });

    audio.addEventListener('ended', () => {
      isPlaying = false;
      playBtn.innerHTML = '<span style="color: white; font-size: 16px;">▶</span>';
      audio.currentTime = 0;
    });

    // Play/Pause button
    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<span style="color: white; font-size: 16px;">▶</span>';
      } else {
        audio.play();
        playBtn.innerHTML = '<span style="color: white; font-size: 14px;">⏸</span>';
      }
      isPlaying = !isPlaying;
    });

    // Wave click to seek
    waveContainer.addEventListener('click', (e) => {
      if (duration === 0) return;
      
      const rect = waveContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      
      audio.currentTime = newTime;
    });

    // Button hover effects
    playBtn.addEventListener('mouseenter', () => {
      playBtn.style.transform = 'scale(1.1)';
      playBtn.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
    });

    playBtn.addEventListener('mouseleave', () => {
      playBtn.style.transform = 'scale(1)';
      playBtn.style.boxShadow = 'none';
    });
  });
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAudioPlayers);
} else {
  initializeAudioPlayers();
}

// Export for manual initialization
export default { initializeAudioPlayers };