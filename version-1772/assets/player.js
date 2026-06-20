(function () {
  window.SitePlayer = function (videoId, buttonId, videoUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !videoUrl) {
      return;
    }
    var loaded = false;
    var hls = null;

    function bindVideo() {
      if (loaded) {
        return Promise.resolve();
      }
      loaded = true;
      video.controls = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        return new Promise(function (resolve) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
          window.setTimeout(resolve, 1600);
        });
      }

      video.src = videoUrl;
      return Promise.resolve();
    }

    function start() {
      bindVideo().then(function () {
        button.classList.add('is-hidden');
        var action = video.play();
        if (action && typeof action.catch === 'function') {
          action.catch(function () {
            button.classList.remove('is-hidden');
          });
        }
      });
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  };
})();
