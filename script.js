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
        let tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            loadVideo(videoId);
        };
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
            onReady: () => {
                isPlayerReady = true;
                displayVideoDuration();
                startProgressBarUpdate();
            }
        }
    });
}

function displayVideoDuration() {
    if (player && isPlayerReady) {
        let duration = player.getDuration();
        document.getElementById("timeDisplay").textContent = `00:00 / ${formatTime(duration)}`;
    }
}

function startProgressBarUpdate() {
    setInterval(() => {
        if (player && isPlayerReady) {
            let currentTime = player.getCurrentTime();
            let duration = player.getDuration();
            document.getElementById("timeDisplay").textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            document.getElementById("progressBar").style.width = `${(currentTime / duration) * 100}%`;
        }
    }, 500);
}

function seekVideo(event) {
    let progressContainer = document.getElementById("progressContainer");
    let seekTime = (event.offsetX / progressContainer.clientWidth) * player.getDuration();
    player.seekTo(seekTime, true);
}

function forward10Seconds() {
    player.seekTo(player.getCurrentTime() + 10, true);
}

function backward10Seconds() {
    player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
}

function togglePause() {
    if (player.getPlayerState() === 1) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function changePlaybackSpeed() {
    player.setPlaybackRate(parseFloat(document.getElementById("playbackSpeed").value));
}

function toggleFullscreen() {
    let videoContainer = document.getElementById("videoContainer");
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function toggleMute() {
    if (player.isMuted()) {
        player.unMute();
    } else {
        player.mute();
    }
}

function adjustVolume(amount) {
    let newVolume = Math.min(100, Math.max(0, player.getVolume() + amount));
    player.setVolume(newVolume);
}

function handleKeyboardShortcuts(event) {
    if (!isPlayerReady) return;

    switch (event.key) {
        case " ":
            event.preventDefault();
            togglePause();
            break;
        case "ArrowRight":
            forward10Seconds();
            break;
        case "ArrowLeft":
            backward10Seconds();
            break;
        case "ArrowUp":
            adjustVolume(10);
            break;
        case "ArrowDown":
            adjustVolume(-10);
            break;
        case "f":
        case "F":
            toggleFullscreen();
            break;
        case "Escape":
            if (document.fullscreenElement) document.exitFullscreen();
            break;
        case "m":
        case "M":
            toggleMute();
            break;
    }
}

function formatTime(time) {
    return `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
}


