let youtubePlayer;

window.onload = function() {
  const queryParams = new URLSearchParams(window.location.search);
  const videoId = queryParams.get('videoId');

  if (videoId) {
    fetchVideoDetails(videoId);
  } else {
    console.error('No video ID provided');
  }
};

function fetchVideoDetails(videoId) {
  axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
    params: {
      part: 'snippet,contentDetails',
      id: videoId,
      key: 'AIzaSyDFfCoDtVA0JvttwHsfkrcL_I-kbc39rOk'
    }
  })
  .then(response => {
    const details = response.data.items[0];
    initializePlayer(details.id);
    updateThumbnailAndTitle(details.snippet);
  })
  .catch(error => {
    console.error('Error fetching video details:', error);
  });
}

function updateThumbnailAndTitle(snippet) {
  const title = snippet.title;
  const thumbnailUrl = snippet.thumbnails.high.url;

  let imgElement = document.getElementById('songThumbnail');
  if (!imgElement) {
    imgElement = document.createElement('img');
    imgElement.id = 'songThumbnail';
    document.querySelector('.card-body').appendChild(imgElement);
  }
  imgElement.src = thumbnailUrl;
  imgElement.alt = title;
  imgElement.classList.add('card-img-top');

  document.getElementById('songTitle').textContent = title;
}

function initializePlayer(videoId) {
  youtubePlayer = new YT.Player('youtubePlayer', {
    height: '0',
    width: '0',
    videoId: videoId,
    playerVars: {
      autoplay: 0,
      controls: 1,
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onError: onPlayerError
    }
  });
}

function onPlayerReady(event) {
  const playButton = document.getElementById('playButton');
  const pauseButton = document.getElementById('pauseButton');
  if (playButton) {
    playButton.addEventListener('click', function() {
      youtubePlayer.playVideo();
    });
  }

  if (pauseButton) {
    pauseButton.addEventListener('click', function() {
      youtubePlayer.pauseVideo();
    });
  }

  document.querySelector('.total-time').textContent = formatTime(youtubePlayer.getDuration());

  setInterval(updatePlayerUI, 1000);
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function updatePlayerUI() {
  const currentTime = youtubePlayer.getCurrentTime();
  const duration = youtubePlayer.getDuration();
  document.querySelector('.current-time').textContent = formatTime(currentTime);
  document.querySelector('.total-time').textContent = formatTime(duration);
}

function onPlayerError(event) {
  console.error('YouTube Player Error:', event.data);
}

function toggleHeart(element) {
    element.classList.toggle('filled');
}

document.addEventListener('DOMContentLoaded', function() {
  let isPlaying = false;
  const playPauseButton = document.querySelector('.play-pause-icon');
  if (playPauseButton) {
    playPauseButton.addEventListener('click', function() {
      if (youtubePlayer && youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
        youtubePlayer.pauseVideo();
        playPauseButton.setAttribute('d', 'M18 12L0 24V0'); 
        isPlaying = false;
      } else if (youtubePlayer) {
        youtubePlayer.playVideo();
        playPauseButton.setAttribute('d', 'M0 0h6v24H0zM12 0h6v24h-6z'); 
        isPlaying = true;
      }
    });
  }
});

const volumeBtn = document.querySelector('.volume-btn');
const volumeControls = document.querySelector('.volume-controls');
const volumeSlider = document.querySelector('.slider');
const volumePin = document.querySelector('#volume-pin');

if (volumeBtn) {
  volumeBtn.addEventListener('click', () => {
    volumeControls.classList.toggle('hidden');
  });
}

if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    if (youtubePlayer && youtubePlayer.setVolume) {
      youtubePlayer.setVolume(value);
    }
  });
}

const updateSlider = () => {
  if (youtubePlayer && youtubePlayer.getVolume) {
    const volume = youtubePlayer.getVolume();
    volumeSlider.value = volume;
    volumePin.style.bottom = `${volume}%`;
  }
};

if (youtubePlayer) {
  youtubePlayer.addEventListener('volumechange', updateSlider);
}

function setInitialVolume() {
  const initVolume = 100; // YouTube default volume
  if (youtubePlayer && youtubePlayer.setVolume) {
    youtubePlayer.setVolume(initVolume);
  }
  updateSlider();
}

setInitialVolume();