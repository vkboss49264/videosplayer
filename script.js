let player; // YouTube player instance
let isFullscreen = false; // Track fullscreen mode

// Save Video ID and Redirect to Player Page
function saveVideoID() {
    let videoId = document.getElementById("videoIdInput").value.trim();
    if (videoId.length === 11) {  // YouTube Video IDs are always 11 characters
        localStorage.setItem("videoID", videoId);
        window.location.href = "player.html"; // Redirect to the player page
    } else {
        alert("Invalid Video ID. Please enter a correct YouTube Video ID.");
    }
}

// Load Video from Video ID Stored in LocalStorage
function loadVideo() {
    let videoId = localStorage.getItem("videoID");

    if (videoId) {
        document.getElementById("videoContainer").innerHTML = `<div id="ytPlayer"></div>`; // Reset container

        player = new YT.Player('ytPlayer', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                controls: 0, // Hide YouTube default controls
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                showinfo: 0,
                playsinline: 1
            },
            events: {
                onReady: () => {
                    document.getElementById("controls").style.display = "flex"; // Show controls
                    preventYouTubeClick();
                }
            }
        });
    } else {
        alert("No video found! Please enter a Video ID on the homepage.");
        window.location.href = "index.html"; // Redirect to homepage
    }
}

// Forward video by 10 seconds
function forward10Seconds() {
    if (player) {
        let currentTime = player.getCurrentTime();
        player.seekTo(currentTime + 10, true);
    }
}

// Backward video by 10 seconds
function backward10Seconds() {
    if (player) {
        let currentTime = player.getCurrentTime();
        player.seekTo(Math.max(0, currentTime - 10), true);
    }
}

// Pause or Play Video
function togglePause() {
    if (player) {
        let state = player.getPlayerState();
        if (state === 1) { // 1 = Playing
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
}

// Toggle Fullscreen Mode
function toggleFullscreen() {
    let container = document.getElementById("videoContainer");
    let iframe = document.querySelector("#ytPlayer");

    if (!isFullscreen) {
        container.classList.add("fullscreen");
        if (iframe) {
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
        }
        isFullscreen = true;
        document.querySelector(".fullscreen-btn").innerText = "🗕 Exit Fullscreen";
    } else {
        container.classList.remove("fullscreen");
        if (iframe) {
            iframe.style.width = "100%"; 
            iframe.style.height = "100%";
        }
        isFullscreen = false;
        document.querySelector(".fullscreen-btn").innerText = "⛶ Fullscreen";
    }
}

// Prevent users from clicking YouTube logo or opening video
function preventYouTubeClick() {
    let iframe = document.querySelector("iframe");
    if (iframe) {
        iframe.style.pointerEvents = "none"; // Disable clicking
    }
}

// Increase Volume
function increaseVolume() {
    if (player) {
        let currentVolume = player.getVolume();
        player.setVolume(Math.min(100, currentVolume + 10)); // Increase volume by 10
    }
}

// Decrease Volume
function decreaseVolume() {
    if (player) {
        let currentVolume = player.getVolume();
        player.setVolume(Math.max(0, currentVolume - 10)); // Decrease volume by 10
    }
}

// Keyboard Shortcuts
document.addEventListener("keydown", function (event) {
    if (!player) return;

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
            increaseVolume();
            break;
        case "ArrowDown":
            decreaseVolume();
            break;
        case "f":
            toggleFullscreen();
            break;
        case "Escape":
            if (isFullscreen) {
                toggleFullscreen(); // Exit fullscreen when Escape key is pressed
            }
            break;
    }
});
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".video-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            let videoId = this.getAttribute("data-video-id");
            localStorage.setItem("videoID", videoId);
            window.location.href = "player.html"; // Redirect to player page
        });
    });
});

