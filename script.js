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
            modestbranding: 1, // Removes YouTube logo
            rel: 0, // Prevent related videos
            controls: 0, // Remove UI controls (including share)
            disablekb: 1, // Disable keyboard interactions
            fs: 0, // Disable fullscreen button
            iv_load_policy: 3, // Hide annotations
            playsinline: 1 // Ensure inline playback on mobile
        },
        events: {
            onReady: onPlayerReady
        }
    });

    // Disable user interaction on iframe
    document.getElementById("ytPlayer").style.pointerEvents = "none";
}

function onPlayerReady() {
    isPlayerReady = true;
    displayVideoDuration();
    startProgressBarUpdate();
}

// Video Control Functions
function togglePause() {
    if (isPlayerReady) {
        player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
    }
}

function forward10Seconds() {
    if (isPlayerReady) player.seekTo(player.getCurrentTime() + 10, true);
}

function backward10Seconds() {
    if (isPlayerReady) player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
}

function toggleFullscreen() {
    let videoContainer = document.getElementById("videoContainer");
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
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
        "m": toggleMute
    };
    if (actions[event.key]) {
        event.preventDefault();
        actions[event.key]();
    }
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
