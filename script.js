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

  // Play button click interaction
  const playBtn = document.getElementById('play-btn');
  const playText = document.getElementById('play-text');
  const turntable = document.getElementById('turntable-disk');
  const waveBars = document.querySelectorAll('.wave-bar');

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playText.textContent = "PAUSE...";
      playBtn.querySelector('i').setAttribute('data-lucide', 'pause');
      turntable.classList.remove('paused');
      waveBars.forEach(bar => bar.style.animationPlayState = 'running');
      startElectronicBeat();
    } else {
      playText.textContent = "PLAY NOW...";
      playBtn.querySelector('i').setAttribute('data-lucide', 'play');
      turntable.classList.add('paused');
      waveBars.forEach(bar => bar.style.animationPlayState = 'paused');
      stopElectronicBeat();
    }
    lucide.createIcons();
  });
});

// Procedural EDM Synth Beat Generator using Web Audio API (no external mp3 needed)
function startElectronicBeat() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let step = 0;
    const bpm = 126;
    const intervalTime = (60 / bpm / 2) * 1000;

    oscInterval = setInterval(() => {
      if (!audioCtx) return;

      const t = audioCtx.currentTime;
      // Kick drum on 1, 3, 5, 7
      if (step % 2 === 0) {
        const kick = audioCtx.createOscillator();
        const kickGain = audioCtx.createGain();
        kick.frequency.setValueAtTime(140, t);
        kick.frequency.exponentialRampToValueAtTime(0.01, t + 0.3);
        kickGain.gain.setValueAtTime(0.7, t);
        kickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        kick.connect(kickGain);
        kickGain.connect(audioCtx.destination);
        kick.start(t);
        kick.stop(t + 0.3);
      }

      // Hi-hat / synth chord pulse
      if (step % 2 === 1) {
        const synth = audioCtx.createOscillator();
        const synthGain = audioCtx.createGain();
        synth.type = 'sawtooth';
        const notes = [220, 261.63, 329.63, 392.00, 440];
        synth.frequency.setValueAtTime(notes[Math.floor(Math.random() * notes.length)], t);
        synthGain.gain.setValueAtTime(0.12, t);
        synthGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        synth.connect(synthGain);
        synthGain.connect(audioCtx.destination);
        synth.start(t);
        synth.stop(t + 0.15);
      }

      step = (step + 1) % 8;
    }, intervalTime);
  } catch (e) {
    console.warn("Web Audio autoplay restriction:", e);
  }
}

function stopElectronicBeat() {
  if (oscInterval) {
    clearInterval(oscInterval);
    oscInterval = null;
  }
}
