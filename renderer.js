let audioFiles = [];
let currentFileIndex = -1;

document.getElementById('selectDirectory').addEventListener('click', async () => {
  const directoryPath = await window.electronAPI.selectDirectory();
  if (directoryPath.length > 0) {
    audioFiles = await window.electronAPI.getAudioFiles(directoryPath[0]);
    createFileList(audioFiles);
  }
});

const prevButton = document.getElementById('prevButton');
const playPauseButton = document.getElementById('playPauseButton');
const nextButton = document.getElementById('nextButton');
const progressBar = document.getElementById('progressBar');
const audioPlayer = document.getElementById('audioPlayer');

prevButton.addEventListener('click', () => {
  if (currentFileIndex > 0) {
    currentFileIndex -= 1;
    const prevFile = audioFiles[currentFileIndex];
    playFile(prevFile);
  }
});

playPauseButton.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.textContent = '❚❚';
  } else {
    audioPlayer.pause();
    playPauseButton.textContent = '►';
  }
});

nextButton.addEventListener('click', () => {
  if (currentFileIndex < audioFiles.length - 1) {
    currentFileIndex += 1;
    const nextFile = audioFiles[currentFileIndex];
    playFile(nextFile);
  }
});

progressBar.addEventListener('input', () => {
  const currentTime = (progressBar.value * audioPlayer.duration) / 100;
  audioPlayer.currentTime = currentTime;
});

audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.value = progress;
  updateProgressTime();
});

audioPlayer.addEventListener('ended', () => {
  playPauseButton.textContent = '►';
});

function createFileList(files) {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';
  files.forEach((file, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.addEventListener('click', () => {
      currentFileIndex = index;
      playFile(file);
    });

    const thumbnail = document.createElement('img');
    thumbnail.src = file.cover ? file.cover : 'assets/default-cover.jpg';
    fileItem.appendChild(thumbnail);

    const info = document.createElement('div');
    info.className = 'info';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = file.tags.title || 'Unknown Title';
    info.appendChild(title);

    const artistAlbum = document.createElement('div');
    artistAlbum.className = 'artist-album';
    artistAlbum.textContent = `${file.tags.artist || 'Unknown Artist'} - ${file.tags.album || 'Unknown Album'}`;
    info.appendChild(artistAlbum);

    fileItem.appendChild(info);

    const duration = document.createElement('div');
    duration.className = 'duration';
    duration.textContent = formatDuration(file.duration || 0);
    fileItem.appendChild(duration);

    fileList.appendChild(fileItem);
  });
}

function playFile(file) {
  audioPlayer.src = file.path;
  audioPlayer.play();
  window.electronAPI.updateCoverImage(file);
  updateMetadata(file);
  playPauseButton.textContent = '❚❚';
}

function updateMetadata(file) {
  document.getElementById('title').textContent = file.tags.title || 'Unknown Title';
  document.getElementById('artist-album').textContent = `${file.tags.artist || 'Unknown Artist'} - ${file.tags.album || 'Unknown Album'}`;
  document.getElementById('duration').textContent = formatDuration(file.duration || 0);
}

function updateProgressTime() {
  const currentTime = formatDuration(audioPlayer.currentTime);
  const durationTime = formatDuration(audioPlayer.duration);
  document.getElementById('duration').textContent = `${currentTime} / ${durationTime}`;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
}
