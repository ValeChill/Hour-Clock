import { playlists } from '../../config/config.js';

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let apiKey = localStorage.getItem('youtubeApiKey');

const selector = document.querySelector("#music-list");
const apiKeyInput = document.querySelector('#apikey');
const track = document.getElementById('track');
const audio = document.getElementById('vertical');
const volumeElement = document.getElementById('volume-icon');
const playButton = document.getElementById('playIcon');
const skipButton = document.getElementById('fwIcon');
const rewindButton = document.getElementById('bwIcon');

for (let list in playlists) {
    let option = document.createElement('option');
    option.value = playlists[list].src;
    option.text = playlists[list].name;
    selector.add(option);
}

if (apiKey) {
    apiKeyInput.value = apiKey;
}

apiKeyInput.addEventListener('change', function() {
    localStorage.setItem('youtubeApiKey', this.value);
});

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('iframe-video', {
        playerVars: {
            listType: 'playlist',
            origin: "https://www.youtube.com",
            mute: 1,
            index: 0,
            startSeconds: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    setTimeout(function() {
        track.max = player.getDuration();
        track.value = player.getCurrentTime();
        audio.value = player.getVolume();
    }, 1000);
}

async function onPlayerStateChange(event) {
    const musicContainer = document.querySelector('.music-container');
    const bars = document.querySelectorAll('.bar');
    const titleElement = document.querySelector('.title');
    const artistElement = document.querySelector('.artist');
    const albumArtElement = document.querySelector('.albumart');
    let musicDock = document.querySelector('.music-dock');

    if (event.data == YT.PlayerState.PLAYING) {
        musicContainer.classList.add('tween');
        track.classList.add('tween');
        audio.classList.add('tween');
        volumeElement.classList.add('tween');
        musicDock.classList.add('tween');

        playButton.setAttribute('name', 'pause');
        bars.forEach(bar => bar.classList.add('playing'));
        track.max = player.getDuration();

        setInterval(function() {
            track.value = player.getCurrentTime();
        }, 50);

        let videoId = player.getVideoData().video_id;

        if (apiKey) {
            let response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
            let data = await response.json();
    
            let videoTitle = data.items[0].snippet.title;
            titleElement.textContent = videoTitle.substring(0, 15);
    
            let videoUploader = data.items[0].snippet.channelTitle;
            artistElement.textContent = videoUploader;
    
            let videoThumbnail = data.items[0].snippet.thumbnails.default.url;
            albumArtElement.style.backgroundImage = `url('${videoThumbnail}')`;
    
            let channelId = data.items[0].snippet.channelId;
            artistElement.innerHTML = `<a href="https://www.youtube.com/channel/${channelId}" target="_blank">${videoUploader}</a>`;
        } else { //If no API Key is provided, use the deprecated function through the iFrame API
            let videoTitle = player.getVideoData().title;
            titleElement.textContent = videoTitle.substring(0, 15);
        }
    } else {
        bars.forEach(bar => bar.classList.remove('playing'));
        playButton.setAttribute('name', 'play');
    }
}

track.addEventListener('input', function() {
    player.seekTo(this.value);
});

audio.addEventListener('input', function() {
    if (audio.value < 5) { //Bad way of doing it, but it works :) , doing audio.value < 1 doesn't work.
        player.mute();
        volumeElement.setAttribute('name', 'volume-mute');
    } else {
        player.unMute();
        player.setVolume(audio.value);

        let volumeLevel = player.getVolume();
        if (volumeLevel < 55) {
            volumeElement.setAttribute('name', 'volume-low');
        } else {
            volumeElement.setAttribute('name', 'volume-full');
        }
    }
});

selector.addEventListener('change', function() {
    if (player) {
        player.destroy();
    }

    player = new YT.Player('iframe-video', {
        playerVars: {
            list: this.value,
            listType: 'playlist',
            index: 0,
            startSeconds: 0,
            origin: "https://www.youtube.com",
            wmode: 'opaque',
            mute: 1
        },
        events: {
            'onReady': function(event) {
                event.target.playVideo();
                setShuffleFunction();
                audio.value = event.target.getVolume();
            },
            'onStateChange': onPlayerStateChange
        }
    });

    function setShuffleFunction(){
        player.setShuffle(true);
        let playlist = player.getPlaylist();
        let randomIndex = Math.floor(Math.random() * playlist.length);
        player.playVideoAt(randomIndex);
        player.unMute();
    }
});

playButton.addEventListener('click', function() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

skipButton.addEventListener('click', function() {
    player.nextVideo();
});

rewindButton.addEventListener('click', function() {
    player.previousVideo();
});