const audio = document.getElementById("audio");
const btnPlay = document.getElementById("btnPlay");
const btnPause = document.getElementById("btnPause");
const btnStop = document.getElementById("btnStop");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// Format waktu mm:ss
function formatTime(sec){
  if(isNaN(sec)) return "--:--";
  const m = Math.floor(sec/60).toString().padStart(2,"0");
  const s = Math.floor(sec%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

// Load metadata
audio.onloadedmetadata = () => {
  durationEl.textContent = formatTime(audio.duration);
};

// Update progress
audio.ontimeupdate = () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  const p = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${p}%`;
};

// PLAY
btnPlay.onclick = () => {
  audio.play();
  btnPlay.disabled = true;
  btnPause.disabled = false;
  btnStop.disabled = false;
};

// PAUSE
btnPause.onclick = () => {
  audio.pause();
  btnPlay.disabled = false;
  btnPause.disabled = true;
};

// STOP
btnStop.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnStop.disabled = true;
};

// Reset ketika audio selesai
audio.onended = () => {
  audio.currentTime = 0;
  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnStop.disabled = true;
};
// --- AUTO STOP KETIKA TAB / HALAMAN TIDAK AKTIF ---
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    audio.pause();
    audio.currentTime = 0;

    btnPlay.disabled = false;
    btnPause.disabled = true;
    btnStop.disabled = true;
  }
});

window.addEventListener("blur", () => {
  audio.pause();
  audio.currentTime = 0;

  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnStop.disabled = true;
});
