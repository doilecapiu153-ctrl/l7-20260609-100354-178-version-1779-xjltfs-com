(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function createHls(video, source) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return null;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return hls;
    }
    video.src = source;
    return null;
  }

  window.initMoviePlayer = function (videoId, source) {
    var video = byId(videoId);
    if (!video || !source) {
      return;
    }
    var root = video.closest(".player-stage");
    var overlay = root ? root.querySelector(".player-overlay") : null;
    var started = false;
    var hls = null;

    function begin() {
      if (!started) {
        hls = createHls(video, source);
        started = true;
      }
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      video.setAttribute("controls", "controls");
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", begin);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        begin();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };
})();
