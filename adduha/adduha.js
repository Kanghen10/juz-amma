// adduha.js
// Versi: 2025-11-15
(function(){
  const audio = document.getElementById('audio');
  const btnPlay = document.getElementById('btnPlay');
  const btnPause = document.getElementById('btnPause');
  const btnStop = document.getElementById('btnStop');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');

  // Format detik ke mm:ss
  function fmt(t){
    if (!isFinite(t)) return "--:--";
    t = Math.floor(t);
    const m = Math.floor(t / 60).toString().padStart(2,'0');
    const s = (t % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  // Update tombol state
  function updateButtons(){
    const playing = !audio.paused && !audio.ended;
    btnPlay.disabled = playing;
    btnPause.disabled = !playing;
    btnStop.disabled = audio.currentTime === 0 && audio.paused;
  }

  // Event: load metadata -> duration
  audio.addEventListener('loadedmetadata', function(){
    durationEl.textContent = fmt(audio.duration);
  });

  // timeupdate -> progress
  audio.addEventListener('timeupdate', function(){
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progressBar.style.width = pct + '%';
    currentTimeEl.textContent = fmt(audio.currentTime);
    updateButtons();
  });

  audio.addEventListener('play', updateButtons);
  audio.addEventListener('pause', updateButtons);
  audio.addEventListener('ended', function(){
    // reset progress on end
    progressBar.style.width = '100%';
    updateButtons();
  });

  // Play
  btnPlay.addEventListener('click', function(){
    // try to load if not yet
    if (audio.readyState === 0) {
      // don't autoplay, but user clicked so allowed
      audio.load();
    }
    audio.play().catch(err => {
      console.warn('Audio play failed:', err);
      alert('Gagal memutar audio. Periksa koneksi atau kebijakan autoplay browser.');
    });
  });

  // Pause
  btnPause.addEventListener('click', function(){
    audio.pause();
  });

  // Stop (pause + reset)
  btnStop.addEventListener('click', function(){
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch(e){
      // some browsers may throw if not allowed; fallback: recreate audio element
      console.warn('Reset currentTime failed, reloading:', e);
      const src = audio.querySelector('source') ? audio.querySelector('source').src : audio.src;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      if (src) {
        audio.src = src;
        audio.load();
      }
    }
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '00:00';
    updateButtons();
  });

  // When user navigates away (tab hide) -> STOP as requested
  function stopOnHidden() {
    if (document.hidden || document.visibilityState !== 'visible') {
      // stop: pause + reset
      if (!audio.paused || audio.currentTime !== 0) {
        audio.pause();
        try { audio.currentTime = 0; } catch(e){ /* ignore */ }
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '00:00';
        updateButtons();
      }
    }
  }

  document.addEventListener('visibilitychange', stopOnHidden);
  window.addEventListener('blur', stopOnHidden);
  // Also stop if page is being unloaded or hidden
  window.addEventListener('pagehide', stopOnHidden);

  // Click on a verse could optionally seek to time if timestamps provided.
  // (No timestamps given, so we simply highlight on click)
  document.querySelectorAll('.verse').forEach(v => {
    v.style.cursor = 'default';
    v.addEventListener('click', function(){
      // brief highlight
      v.animate([{ boxShadow: '0 6px 18px rgba(11,20,30,0.06)' }, { boxShadow: '0 12px 28px rgba(11,20,30,0.12)' }, { boxShadow: '0 6px 18px rgba(11,20,30,0.06)' }], { duration: 420 });
    });
  });

  // Initial UI state
  durationEl.textContent = "--:--";
  currentTimeEl.textContent = "00:00";
  progressBar.style.width = '0%';
  updateButtons();

  // Accessibility: keyboard shortcuts
  document.addEventListener('keydown', function(e){
    if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      // space toggles play/pause
      e.preventDefault();
      if (audio.paused) btnPlay.click(); else btnPause.click();
    } else if (e.key === 's' || e.key === 'S') {
      btnStop.click();
    }
  });

  // If audio fails to load, show message in console
  audio.addEventListener('error', function(e){
    console.warn('Audio error:', audio.error);
  });

})();
