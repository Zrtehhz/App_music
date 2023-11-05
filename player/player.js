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
      'autoplay': 1,
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