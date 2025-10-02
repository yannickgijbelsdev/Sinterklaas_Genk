// Convert existing HTML5 audio elements to wave players
const convertExistingAudioElements = () => {
  // Look for entire audio containers (div elements that contain audio + filename)
  document.querySelectorAll('div').forEach(div => {
    // Skip if already converted
    if (div.classList.contains('wave-audio-container')) return;
    
    const audio = div.querySelector('audio[controls]');
    const h4 = div.querySelector('h4');
    
    // If this div contains both audio and h4 with filename
    if (audio && h4 && (h4.textContent.includes('.mp3') || h4.textContent.includes('🎵'))) {
      const src = audio.src || (audio.querySelector('source') ? audio.querySelector('source').src : '');
      if (!src) return;

      // Create wave player HTML
      const wavePlayerHTML = `
        <div class="wave-audio-container" data-audio-src="${src}" style="margin: 20px 0;">
          <div style="background: linear-gradient(135deg, #FEF7ED 0%, #FEF3C7 100%); border-radius: 16px; padding: 20px; border: 2px solid #DC2626; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <button class="audio-play-btn" style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;">
                <span style="color: white; font-size: 16px;">▶</span>
              </button>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #B91C1C; min-width: 100px;">
                <span class="current-time">0:00</span>
                <span style="opacity: 0.6;">/</span>
                <span class="total-time" style="opacity: 0.8;">0:00</span>
              </div>
            </div>
            <div class="wave-container" style="position: relative; height: 80px; background: #FFFFFF; border-radius: 8px; border: 1px solid #FED7D7; cursor: pointer; overflow: hidden; display: flex; align-items: end; gap: 2px; padding: 8px 4px;">
              <div class="wave-progress" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%); border-radius: 8px; transition: width 0.1s ease; z-index: 1;"></div>
              ${Array.from({length: 50}, (_, i) => {
                const height = Math.random() * 60 + 20;
                return `<div style="width: 6px; height: ${height}%; background: linear-gradient(to top, #E5E7EB, #F3F4F6); border-radius: 3px; transition: all 0.3s ease; z-index: 2; position: relative;"></div>`;
              }).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 12px; color: #B91C1C; opacity: 0.7;">
              <span>Klik op de wave om door te spoelen</span>
              <span class="progress-percentage">0%</span>
            </div>
          </div>
          <audio class="hidden-audio" style="display: none;" preload="metadata">
            <source src="${src}" type="audio/mpeg">
          </audio>
        </div>
      `;

      // Replace the entire div with new wave player
      div.outerHTML = wavePlayerHTML;
    }
  });
};

// Utility functions for custom wave audio player
export const initializeAudioPlayers = () => {
  // First, convert existing HTML5 audio elements to wave players
  convertExistingAudioElements();
  
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