// Audio playback demo with Web Audio API synthesizer for instant fun beats
let isPlaying = false;
let audioCtx = null;
let oscInterval = null;

// Initialize GSAP animations on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  // GSAP Entrance Animations
  gsap.from("#navbar", {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from("#hero-text > *", {
    x: -60,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: "power2.out",
    delay: 0.2
  });

  gsap.from("#top-badge", {
    x: 60,
    y: -30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.3
  });

  gsap.from("#mid-badge", {
    x: 50,
    opacity: 0,
    duration: 0.9,
    ease: "back.out(1.7)",
    delay: 0.5
  });

  gsap.from("#center-dj", {
    scale: 0.85,
    opacity: 0,
    duration: 1.2,
    ease: "elastic.out(1, 0.75)",
    delay: 0.3
  });

  gsap.from("#bottom-left-card", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.6
  });

  gsap.from("#bottom-right-card", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.7
  });

  // Dots active state switcher
  const dots = document.querySelectorAll('.indicator-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => {
        d.classList.replace('bg-[#ff1e38]', 'bg-red-950');
        d.classList.remove('w-4', 'h-4', 'shadow-[0_0_10px_#ff1e38]');
        d.classList.add('w-2.5', 'h-2.5', 'border', 'border-red-500');
      });
      
      dot.classList.replace('bg-red-950', 'bg-[#ff1e38]');
      dot.classList.remove('w-2.5', 'h-2.5', 'border', 'border-red-500');
      dot.classList.add('w-4', 'h-4', 'shadow-[0_0_10px_#ff1e38]');
    });
  });

  // Attend button click interaction
  const attendBtn = document.getElementById('attend-btn');
  if (attendBtn) {
    attendBtn.addEventListener('click', () => {
      alert("🎉 Thank you for joining the VIP DJ Experience! Pass sent to your account.");
    });
  }

  // Audio Playback & Volume Fade-in logic
  const bgAudio = document.getElementById('bg-audio');
  const playBtn = document.getElementById('play-btn');
  const playText = document.getElementById('play-text');
  const turntable = document.getElementById('turntable-disk');
  const waveBars = document.querySelectorAll('.wave-bar');
  let isPlaying = false;
  let fadeInterval = null;

  function setPlayingUI(playing) {
    isPlaying = playing;
    if (playing) {
      if (playText) playText.textContent = "PAUSE...";
      const icon = playBtn ? playBtn.querySelector('i') : null;
      if (icon) icon.setAttribute('data-lucide', 'pause');
      if (turntable) turntable.classList.remove('paused');
      waveBars.forEach(bar => bar.style.animationPlayState = 'running');
    } else {
      if (playText) playText.textContent = "PLAY NOW...";
      const icon = playBtn ? playBtn.querySelector('i') : null;
      if (icon) icon.setAttribute('data-lucide', 'play');
      if (turntable) turntable.classList.add('paused');
      waveBars.forEach(bar => bar.style.animationPlayState = 'paused');
    }
    lucide.createIcons();
  }

  // Smooth Volume Fade In
  function fadeInAudio(targetVolume = 1.0, durationMs = 3000) {
    if (!bgAudio) return;
    if (fadeInterval) clearInterval(fadeInterval);

    bgAudio.volume = 0.05;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setPlayingUI(true);
        const steps = 30;
        const stepTime = durationMs / steps;
        const volumeIncrement = targetVolume / steps;

        fadeInterval = setInterval(() => {
          if (bgAudio.volume + volumeIncrement < targetVolume) {
            bgAudio.volume += volumeIncrement;
          } else {
            bgAudio.volume = targetVolume;
            clearInterval(fadeInterval);
            fadeInterval = null;
          }
        }, stepTime);
      }).catch(err => {
        console.warn("Autoplay was prevented by browser, click anywhere to start:", err);
      });
    }
  }

  // Fade out audio before pausing
  function fadeOutAudio(durationMs = 600) {
    if (!bgAudio || bgAudio.paused) return;
    if (fadeInterval) clearInterval(fadeInterval);

    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeDecrement = bgAudio.volume / steps;

    fadeInterval = setInterval(() => {
      if (bgAudio.volume - volumeDecrement > 0.05) {
        bgAudio.volume -= volumeDecrement;
      } else {
        bgAudio.volume = 0;
        bgAudio.pause();
        clearInterval(fadeInterval);
        fadeInterval = null;
        setPlayingUI(false);
      }
    }, stepTime);
  }

  // Tự động kích hoạt khi người dùng chạm hoặc click vào BẤT KỲ ĐÂU trên trang
  let userInteracted = false;
  function triggerAudioOnInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      fadeInAudio(1.0, 3000);
      document.removeEventListener('click', triggerAudioOnInteraction);
      document.removeEventListener('keydown', triggerAudioOnInteraction);
      document.removeEventListener('touchstart', triggerAudioOnInteraction);
    }
  }

  document.addEventListener('click', triggerAudioOnInteraction);
  document.addEventListener('keydown', triggerAudioOnInteraction);
  document.addEventListener('touchstart', triggerAudioOnInteraction);

  // Nút PLAY NOW / PAUSE click
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userInteracted = true;
      if (!isPlaying) {
        fadeInAudio(1.0, 1500);
      } else {
        fadeOutAudio(500);
      }
    });
  }
});
