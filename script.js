let player;
let isPlayerReady = false;

document.addEventListener("DOMContentLoaded", () => {
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("videoId")) {
let videoId = urlParams.get("videoId");
loadYouTubeAPI(videoId);
}

document.addEventListener("keydown", handleKeyboardShortcuts);

});

function loadYouTubeAPI(videoId) {
if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
let script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(script);

window.onYouTubeIframeAPIReady = () => loadVideo(videoId);  
} else {  
    loadVideo(videoId);  
}

}

function loadVideo(videoId) {
player = new YT.Player("ytPlayer", {
height: "100%",
width: "100%",
videoId: videoId,
playerVars: {
autoplay: 1,
modestbranding: 1,
rel: 0,
controls: 0,
disablekb: 1,
fs: 0,
iv_load_policy: 3,
playsinline: 1
},
events: {
onReady: onPlayerReady
}
});
}

function onPlayerReady() {
isPlayerReady = true;
displayVideoDuration();
startProgressBarUpdate();
}

function displayVideoDuration() {
if (isPlayerReady) {
let duration = player.getDuration();
if (!isNaN(duration) && duration > 0) {
document.getElementById("timeDisplay").textContent = 00:00 / ${formatTime(duration)};
}
}
}

function startProgressBarUpdate() {
setInterval(() => {
if (isPlayerReady) {
let currentTime = player.getCurrentTime();
let duration = player.getDuration();
if (!isNaN(currentTime) && !isNaN(duration) && duration > 0) {
document.getElementById("timeDisplay").textContent = ${formatTime(currentTime)} / ${formatTime(duration)};
document.getElementById("progressBar").style.width = ${(currentTime / duration) * 100}%;
}
}
}, 500);
}

function seekVideo(event) {
let progressContainer = document.getElementById("progressContainer");
let seekTime = (event.offsetX / progressContainer.clientWidth) * player.getDuration();
player.seekTo(seekTime, true);
}

function forward10Seconds() {
if (isPlayerReady) player.seekTo(player.getCurrentTime() + 10, true);
}

function backward10Seconds() {
if (isPlayerReady) player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
}

function togglePause() {
if (isPlayerReady) {
const state = player.getPlayerState();
state === 1 ? player.pauseVideo() : player.playVideo();
}
}

function changePlaybackSpeed() {
if (isPlayerReady) {
player.setPlaybackRate(parseFloat(document.getElementById("playbackSpeed").value));
}
}

function toggleFullscreen() {
let videoContainer = document.getElementById("videoContainer");
if (!document.fullscreenElement) {
videoContainer.requestFullscreen?.() || videoContainer.mozRequestFullScreen?.() || videoContainer.webkitRequestFullscreen?.() || videoContainer.msRequestFullscreen?.();
} else {
document.exitFullscreen?.() || document.mozCancelFullScreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
}
}

function toggleMute() {
if (isPlayerReady) player.isMuted() ? player.unMute() : player.mute();
}

function adjustVolume(amount) {
if (isPlayerReady) {
let newVolume = Math.min(100, Math.max(0, player.getVolume() + amount));
player.setVolume(newVolume);
}
}

function handleKeyboardShortcuts(event) {
if (!isPlayerReady) return;
const actions = {
" ": togglePause,
"ArrowRight": forward10Seconds,
"ArrowLeft": backward10Seconds,
"ArrowUp": () => adjustVolume(10),
"ArrowDown": () => adjustVolume(-10),
"f": toggleFullscreen,
"F": toggleFullscreen,
"Escape": () => document.fullscreenElement && document.exitFullscreen(),
"m": toggleMute,
"M": toggleMute
};
if (actions[event.key]) {
event.preventDefault();
actionsevent.key;
}
}

function formatTime(time) {
let hours = Math.floor(time / 3600);
let minutes = Math.floor((time % 3600) / 60);
let seconds = Math.floor(time % 60);
return (hours > 0 ? ${hours}: : "") + ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")};
}
This my script.js file
