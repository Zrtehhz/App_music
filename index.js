// index.js


async function fetchMusic() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: 'AIzaSyDFfCoDtVA0JvttwHsfkrcL_I-kbc39rOk',
        part: 'snippet',
        maxResults: 200,
        type: 'video',
        q: 'gta rp musique RAP Flashback'
      }
    });
    
    const musicList = response.data.items;
    
    let html = '';
    musicList.forEach(video => {
      html += `
        <div class="music-item" data-video-id="${video.id.videoId}">
          <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
          <p>${video.snippet.title}</p>
        </div>
      `;
    });
    
    const musicContainer = document.querySelector('#musicList');
    if (musicContainer) {
      musicContainer.innerHTML = html;
      
      initMusicItems();
    } else {
      throw new Error('Music container not found');
    }
    
  } catch (error) {
    console.error(error);
  }
}

function initMusicItems() {
  const musicItems = document.querySelectorAll('.music-item');

  musicItems.forEach(item => {
    item.addEventListener('click', handleMusicItemClick);
  });
}

function handleMusicItemClick(event) {
  const videoId = event.currentTarget.dataset.videoId;
  window.location.href = `../../player/player.html?videoId=${videoId}`;
}

fetchMusic();