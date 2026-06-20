function initMoviePlayer(streamUrl) {
    var video = document.getElementById("movieVideo");
    var button = document.getElementById("playButton");
    var shell = document.getElementById("playerShell");
    var started = false;
    var hlsInstance = null;

    if (!video || !button || !shell || !streamUrl) {
        return;
    }

    function playVideo() {
        var playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
            playResult.catch(function () {
                button.classList.remove("is-hidden");
                started = false;
            });
        }
    }

    function begin() {
        if (started) {
            playVideo();
            return;
        }
        started = true;
        button.classList.add("is-hidden");

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            playVideo();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                playVideo();
            });
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    try {
                        hlsInstance.destroy();
                    } catch (error) {}
                    video.src = streamUrl;
                    playVideo();
                }
            });
            return;
        }

        video.src = streamUrl;
        playVideo();
    }

    button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        begin();
    });

    shell.addEventListener("click", function (event) {
        if (event.target === shell || event.target === video) {
            begin();
        }
    });

    video.addEventListener("play", function () {
        button.classList.add("is-hidden");
    });
}
