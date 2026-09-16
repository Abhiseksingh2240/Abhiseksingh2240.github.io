(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('details[open]').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  if (reducedMotion) return;
  const canvas = document.querySelector('#signal-canvas');
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let points = [];

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(42, Math.max(18, Math.floor(width / 35)));
    points = Array.from({ length: count }, (_, index) => ({
      x: (index / count) * width + Math.random() * 40,
      y: Math.random() * height,
      speed: .08 + Math.random() * .2,
      size: .6 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
    }));
  };

  const draw = (time) => {
    context.clearRect(0, 0, width, height);
    points.forEach((point, index) => {
      point.x += point.speed;
      if (point.x > width + 10) point.x = -10;
      const y = point.y + Math.sin(time * .00035 + point.phase) * 14;
      context.beginPath();
      context.arc(point.x, y, point.size, 0, Math.PI * 2);
      context.fillStyle = index % 7 === 0 ? '#f4b860' : '#64717a';
      context.fill();
    });
    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(draw);
})();
