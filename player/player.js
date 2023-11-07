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
  
  const imgElement = document.getElementById('songThumbnail') || document.createElement('img');
  imgElement.id = 'songThumbnail';
  imgElement.src = thumbnailUrl;
  imgElement.alt = title;
  imgElement.classList.add('card-img-top');

  const cardBodyElement = document.querySelector('.card-body');
  const oldImage = document.getElementById('songThumbnail');
  if (oldImage) {
    cardBodyElement.removeChild(oldImage);
  }
  cardBodyElement.insertBefore(imgElement, cardBodyElement.firstChild);

  document.getElementById('songTitle').textContent = title;
}

function initializePlayer(videoId) {
  youtubePlayer = new YT.Player('youtubePlayer', {
    height: '0',
    width: '0',
    videoId: videoId,

    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onError': onPlayerError
    }
  });
}

function onPlayerReady(event) {
  document.getElementById('playButton').addEventListener('click', function() {
    youtubePlayer.playVideo();
  });

  document.getElementById('pauseButton').addEventListener('click', function() {
    youtubePlayer.pauseVideo();
  });
}

function onPlayerError(event) {
  console.error('YouTube Player Error:', event.data);
}

function toggleHeart(element) {
    element.classList.toggle('filled'); // Basculer la classe pour changer l'apparence du cœur
    if (element.classList.contains('filled')) {
    }
}


document.addEventListener('DOMContentLoaded', function() {
  var playPauseButton = document.querySelector('.play-pause-icon');
  var currentTimeElement = document.querySelector('.current-time');
  var totalTimeElement = document.querySelector('.total-time');
  var isPlaying = false;

  // Mise à jour initiale du temps total (sera mis à jour après le chargement de la vidéo)
  totalTimeElement.textContent = '0:00';

  // Gestionnaire de clic pour le bouton de lecture/pause
  playPauseButton.addEventListener('click', function() {
    if (youtubePlayer && youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      youtubePlayer.pauseVideo();
      playPauseButton.setAttribute('d', 'M18 12L0 24V0'); // SVG path for 'play' icon
      isPlaying = false;
    } else if (youtubePlayer) {
      youtubePlayer.playVideo();
      playPauseButton.setAttribute('d', 'M0 0h6v24H0zM12 0h6v24h-6z'); // SVG path for 'pause' icon
      isPlaying = true;
    }
  });

  // Mise à jour de l'interface utilisateur avec l'état actuel de la vidéo
  function updatePlayerUI() {
    if (youtubePlayer) {
      var currentTime = youtubePlayer.getCurrentTime();
      var duration = youtubePlayer.getDuration();
      currentTimeElement.textContent = formatTime(currentTime);
      totalTimeElement.textContent = formatTime(duration);
      // Mise à jour de la barre de progression si nécessaire
    }
  }

  // Fonction pour formater le temps en minutes:secondes
  function formatTime(timeInSeconds) {
    if (!isNaN(timeInSeconds)) {
      var minutes = Math.floor(timeInSeconds / 60);
      var seconds = Math.floor(timeInSeconds % 60);
      return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }
    return '0:00';
  }

  // Mettre à jour l'UI régulièrement
  setInterval(updatePlayerUI, 1000);
});


// Intégrez ceci dans votre fonction onPlayerReady
function onPlayerReady(event) {
  // La mise à jour initiale du temps total doit être ici
  var duration = youtubePlayer.getDuration();
  document.querySelector('.total-time').textContent = formatTime(duration);

  // Plus besoin d'ajouter des gestionnaires d'événements ici,
  // car nous avons déjà ajouté l'écouteur d'événements ci-dessus
}

// Récupérer les éléments du DOM
const volumeBtn = document.querySelector('.volume-btn');
const volumeControls = document.querySelector('.volume-controls');
const volumeSlider = document.querySelector('.slider');
const volumePin = document.querySelector('#volume-pin');

// Récupérer la vidéo  
const video = document.querySelector('video');

// Afficher/Masquer les contrôles du volume
volumeBtn.addEventListener('click', () => {
  volumeControls.classList.toggle('hidden');
});

// Mettre à jour le volume lors du déplacement du slider
volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  video.volume = value / 100;
});

// Mettre à jour la position du slider selon le volume
const updateSlider = () => {
  const volume = Math.round(video.volume * 100);
  volumeSlider.value = volume;
  volumePin.style.bottom = `${volume}%`;
};

video.addEventListener('volumechange', updateSlider);

// Initialiser 
updateSlider();