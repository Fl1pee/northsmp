'use strict';

(() => {
  const SNOW_COUNT_MULTIPLIER = 1;
  const SNOW_SPEED_MULTIPLIER = 1;
  const canvas = document.getElementById('snow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1, flakes = [], raf = 0, last = 0;

  function create(isFirst) {
    return {
      x: Math.random() * width,
      y: isFirst ? Math.random() * height : -12,
      radius: Math.random() * 3 + 2.8,
      velocity: (Math.random() * .45 + .25) * SNOW_SPEED_MULTIPLIER,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      rotation: (Math.random() - .5) * .007,
      opacity: Math.random() * .43 + .32
    };
  }
  function resize() {
    width = innerWidth;
    height = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flakes = Array.from({length: Math.min(110, Math.round(width / 23 * SNOW_COUNT_MULTIPLIER))}, () => create(true));
  }
  function draw(flake) {
    const r = flake.radius;
    ctx.save();
    ctx.translate(flake.x, flake.y);
    ctx.rotate(flake.angle);
    ctx.strokeStyle = `rgba(228,239,255,${flake.opacity})`;
    ctx.lineWidth = .85;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * i / 3;
      const dx = Math.cos(a), dy = Math.sin(a);
      const bx = r * .65 * dx, by = r * .65 * dy;
      ctx.moveTo(0, 0);
      ctx.lineTo(r * dx, r * dy);
      ctx.moveTo(bx - r * .27 * Math.cos(a - Math.PI / 3), by - r * .27 * Math.sin(a - Math.PI / 3));
      ctx.lineTo(bx, by);
      ctx.lineTo(bx - r * .27 * Math.cos(a + Math.PI / 3), by - r * .27 * Math.sin(a + Math.PI / 3));
    }
    ctx.stroke();
    ctx.restore();
  }
  function frame(time) {
    const delta = Math.min((time - (last || time)) / 16.667, 2.4);
    last = time;
    ctx.clearRect(0, 0, width, height);
    for (const f of flakes) {
      f.y += f.velocity * delta;
      f.x += Math.sin(time / 1600 + f.phase) * .21 * delta;
      f.angle += f.rotation * delta;
      if (f.y > height + 12 || f.x < -15 || f.x > width + 15) Object.assign(f, create(false));
      draw(f);
    }
    raf = requestAnimationFrame(frame);
  }
  function restart() {
    cancelAnimationFrame(raf);
    last = 0;
    if (reduced) {ctx.clearRect(0,0,width,height);flakes.forEach(draw);}
    else if (!document.hidden) raf = requestAnimationFrame(frame);
  }
  resize();
  restart();
  addEventListener('resize', () => {resize();restart();}, {passive:true});
  document.addEventListener('visibilitychange', restart);
})();
