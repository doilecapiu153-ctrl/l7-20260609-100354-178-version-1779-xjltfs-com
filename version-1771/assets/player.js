(function () {
  function createPlayer(root) {
    var video = root.querySelector('video');
    var cover = root.querySelector('.player-cover');
    var button = root.querySelector('.play-trigger');
    var stream = root.getAttribute('data-stream');
    var attached = false;
    var hls = null;

    function attachStream() {
      if (attached || !video || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      attached = true;
    }

    function play() {
      attachStream();
      root.classList.add('is-playing');
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          root.classList.remove('is-playing');
        });
      }
    }

    function toggle() {
      if (!attached || video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        play();
      });
    }

    if (cover) {
      cover.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', toggle);
      video.addEventListener('play', function () {
        root.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0) {
          root.classList.remove('is-playing');
        }
      });
      video.addEventListener('ended', function () {
        root.classList.remove('is-playing');
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll('.video-player[data-stream]').forEach(createPlayer);
})();
