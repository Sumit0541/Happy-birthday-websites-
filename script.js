(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Countdown always points to the next 4 November; no birth year or age is assumed.
  function updateCountdown() {
    const now = new Date();
    let target = new Date(now.getFullYear(), 10, 4, 0, 0, 0);
    if (now >= target) target = new Date(now.getFullYear() + 1, 10, 4, 0, 0, 0);
    const ms = target - now;
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms / 3600000) % 24;
    const minutes = Math.floor(ms / 60000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;
    $('#countdownTitle').textContent = days === 0 && hours === 0 && minutes === 0 ? 'It is birthday time! 🎉' : 'Birthday magic is coming!';
    $('#countdownText').textContent = days === 0 ? 'The big day is almost here!' : 'Until 4 November';
    $('#countdownNumbers').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Gentle reveal on scroll, with a safe fallback for older browsers.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  // Local-only photo picker. Files are not uploaded to a server.
  const photoUpload = $('#photoUpload');
  const photoGrid = $('#photoGrid');
  const objectUrls = [];
  if (photoUpload && photoGrid) photoUpload.addEventListener('change', event => {
    const files = [...(event.target.files || [])].filter(file => file.type.startsWith('image/')).slice(0, 24);
    if (!files.length) return;
    photoGrid.replaceChildren();
    files.forEach((file, index) => {
      const url = URL.createObjectURL(file); objectUrls.push(url);
      const card = document.createElement('article'); card.className = 'photo-card';
      const frame = document.createElement('div'); frame.className = 'photo-frame';
      const img = document.createElement('img'); img.src = url; img.alt = `Yana photo ${index + 1}`; img.loading = 'lazy';
      const title = document.createElement('h3'); title.textContent = ['Little sunshine ☀️', 'Tiny superstar ✨', 'Favourite memory 💗'][index % 3];
      const caption = document.createElement('p'); caption.textContent = 'A moment worth keeping forever.';
      frame.append(img); card.append(frame, title, caption); photoGrid.append(card);
    });
  });
  window.addEventListener('pagehide', () => objectUrls.forEach(URL.revokeObjectURL));

  // Animated storybook folders. Replace the sample copy with your real shared memories.
  const storyPages = {
    first: { icon: '🌷', kicker: 'PAGE 01 · OUR BEGINNING', title: 'How we first met', text: 'Every lovely story has a first page. I want to remember the day we first met, the first things we said, and how a simple beginning became a precious part of our family story.', note: '✍️ Add your real first-meeting memory here to make this page truly yours.' },
    best: { icon: '📸', kicker: 'PAGE 02 · LITTLE MOMENTS, FOREVER', title: 'Our best memories', text: 'The best memories are not always the biggest events. Sometimes they are silly jokes, random talks, shared treats, tiny celebrations and those moments that still make us smile when we remember them.', note: '💗 Add 2–5 favourite moments, dates, photos or your funniest inside joke.' },
    thanks: { icon: '🫶', kicker: 'PAGE 03 · FROM MY HEART', title: 'Thank you for being here', text: 'Thank you for being part of my life, for bringing your own little kind of magic into our family, and for giving us so many reasons to smile. You never have to do anything special to be loved — being you is already special.', note: '💌 A little thank-you from Sumit bhaiya, with all my love.' },
    qualities: { icon: '✨', kicker: 'PAGE 04 · YOUR SUPERPOWERS', title: 'Things I love about you', text: 'Your smile can brighten an ordinary day. Your curiosity makes the world more interesting, your little ways make you wonderfully you, and your presence brings a kind of happiness no gift could ever replace.', note: '🌟 Personalize this with her real qualities: kind, brave, funny, curious, caring or creative.' },
    flaws: { icon: '🙈', kicker: 'PAGE 05 · CUTE CHAOS ONLY', title: 'Your cute little flaws 😂', text: 'A tiny bit stubborn? Maybe. Expert at making those innocent eyes? Absolutely. Getting your way with one smile? Suspiciously talented. But these little quirks are part of your charm — and they make our days funnier.', note: '😂 Swap in your family’s gentle inside jokes. Keep it playful, never hurtful.' },
    promise: { icon: '🎀', kicker: 'PAGE 06 · ALWAYS YOUR BHAIYA', title: 'A promise for you', text: 'I cannot promise every day will be perfect, but I can promise to cheer for you, listen when you need someone, celebrate your little wins and remind you how important you are. Keep growing, keep laughing and always be your own wonderful self.', note: '💖 Happy Birthday, Yana. You will always have love cheering you on.' }
  };
  const storyFolders = $$('.story-folder');
  const storyPage = $('#storyPage');
  storyFolders.forEach(folder => folder.addEventListener('click', () => {
    const page = storyPages[folder.dataset.story];
    if (!page || !storyPage) return;
    storyFolders.forEach(item => { item.classList.toggle('active', item === folder); item.setAttribute('aria-pressed', String(item === folder)); });
    storyPage.classList.remove('page-refresh'); void storyPage.offsetWidth; storyPage.classList.add('page-refresh');
    $('#storyPageIcon').textContent = page.icon;
    $('.story-page-kicker').textContent = page.kicker;
    $('#storyPageTitle').textContent = page.title;
    $('#storyPageText').textContent = page.text;
    $('#storyPageNote').textContent = page.note;
    playChime();
  }));

  // Lightweight confetti using canvas, no third-party library needed.
  const canvas = $('#confetti');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let bits = [], frameId = 0, running = false;
  const colors = ['#ff72ac', '#ffd166', '#a98af5', '#8bd8dc', '#ff9f80', '#fff'];
  function resizeCanvas() { if (!canvas) return; const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  if (canvas && ctx) { resizeCanvas(); window.addEventListener('resize', resizeCanvas); }
  function celebrate(amount = 150) {
    if (!ctx || !canvas) return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bits = bits.concat(Array.from({ length: reduced ? 25 : amount }, () => ({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .35, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, size: 4 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - .5) * .2, color: colors[Math.floor(Math.random() * colors.length)], shape: Math.random() > .5 }))).slice(-450);
    if (!running) { running = true; animateConfetti(); }
  }
  function animateConfetti() {
    if (!ctx || !canvas) { running = false; return; }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    bits = bits.filter(bit => bit.y < innerHeight + 30);
    bits.forEach(bit => { bit.x += bit.vx; bit.y += bit.vy; bit.rot += bit.vr; bit.vy += .025; ctx.save(); ctx.translate(bit.x, bit.y); ctx.rotate(bit.rot); ctx.fillStyle = bit.color; if (bit.shape) { ctx.beginPath(); ctx.ellipse(0, 0, bit.size, bit.size * .55, 0, 0, Math.PI * 2); ctx.fill(); } else ctx.fillRect(-bit.size / 2, -bit.size / 2, bit.size, bit.size); ctx.restore(); });
    if (bits.length) frameId = requestAnimationFrame(animateConfetti); else { running = false; cancelAnimationFrame(frameId); ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  $('#sprinkleBtn')?.addEventListener('click', () => celebrate(100));
  $('#finalConfetti')?.addEventListener('click', () => { celebrate(230); playChime(); });

  // Birthday gift reveal.
  $('#giftBtn')?.addEventListener('click', () => {
    const message = $('#giftMessage');
    if (message) { message.hidden = false; $('#giftBtn').classList.add('opened'); $('#giftBtn .gift-caption').textContent = 'A little love, just for you ♡'; celebrate(190); playChime(); message.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });

  // Candle taps work independently; after all are out, show the wish message.
  const flames = $$('.mini-flame');
  flames.forEach(flame => flame.addEventListener('click', () => {
    if (!flame.classList.contains('lit')) return;
    flame.classList.remove('lit'); flame.textContent = '💨'; playChime();
    if (!flames.some(item => item.classList.contains('lit'))) { $('#wishText').textContent = 'Wish made! May all your little dreams find their way to you. 💖'; celebrate(140); $('#wishBtn').textContent = 'Wish sent to the stars ✨'; }
  }));
  $('#wishBtn')?.addEventListener('click', () => { $('#wishText').textContent = 'Close your eyes, make a wish, then tap each flame. 🌠'; flames.forEach(flame => { flame.classList.add('lit'); flame.textContent = '🔥'; }); $('#wishBtn').textContent = 'Make a wish ✨'; celebrate(45); });

  // Tiny original chime via Web Audio. Browsers require a user gesture first.
  let audioContext;
  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext ||= new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      [659.25, 783.99, 987.77].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, audioContext.currentTime + index * .12);
        gain.gain.exponentialRampToValueAtTime(.11, audioContext.currentTime + index * .12 + .025);
        gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + index * .12 + .42);
        oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(audioContext.currentTime + index * .12); oscillator.stop(audioContext.currentTime + index * .12 + .45);
      });
    } catch (_) { /* Audio is optional; the page remains usable if blocked. */ }
  }
  // Music button toggles gentle generated ambient tones (not an external song).
  let musicTimer = null, musicOn = false, musicStep = 0;
  const musicNotes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
  function musicNote() {
    if (!musicOn) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext; if (!AudioCtx) return;
      audioContext ||= new AudioCtx(); if (audioContext.state === 'suspended') audioContext.resume();
      const osc = audioContext.createOscillator(), gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.value = musicNotes[musicStep++ % musicNotes.length];
      gain.gain.setValueAtTime(.0001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.035, audioContext.currentTime + .15); gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + 1.05);
      osc.connect(gain); gain.connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + 1.1);
    } catch (_) { /* Audio unsupported or blocked. */ }
  }
  $('#musicBtn')?.addEventListener('click', () => {
    musicOn = !musicOn; const button = $('#musicBtn'); button.textContent = musicOn ? '♫ Sound on' : '♫ Sound off'; button.setAttribute('aria-pressed', String(musicOn));
    if (musicOn) { playChime(); musicNote(); musicTimer = window.setInterval(musicNote, 900); } else { window.clearInterval(musicTimer); musicTimer = null; }
  });
})();
