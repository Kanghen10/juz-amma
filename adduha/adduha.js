const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const stopBtn = document.getElementById("stop");
const verses = [...document.querySelectorAll(".verse")];

/* ---- PLAY ---- */
playBtn.onclick = () => audio.play();

/* ---- PAUSE ---- */
pauseBtn.onclick = () => audio.pause();

/* ---- STOP ---- */
stopBtn.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
  clearActive();
};

/* ---- AUTO-HIGHLIGHT ---- */
audio.ontimeupdate = () => {
  const t = audio.currentTime;
  
  for (let i = 0; i < verses.length; i++) {
    let start = parseFloat(verses[i].dataset.start);
    let next = i < verses.length - 1 ? parseFloat(verses[i+1].dataset.start) : 9999;

    if (t >= start && t < next) {
      clearActive();
      verses[i].classList.add("active");
      return;
    }
  }
};

/* ---- CLEAR HIGHLIGHT ---- */
function clearActive(){
  verses.forEach(v => v.classList.remove("active"));
}

/* ---- STOP WHEN TAB NOT VISIBLE ---- */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    audio.pause();
    audio.currentTime = 0;
    clearActive();
  }
});
