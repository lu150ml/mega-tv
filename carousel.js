(() => {
  const track = document.querySelector('[data-carousel]');
  const previous = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  if (!track || !previous || !next) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;

  const cardStep = () => {
    const card = track.querySelector('.poster-card');
    return card ? card.getBoundingClientRect().width + 14 : 220;
  };

  const updateButtons = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };

  const move = (direction) => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    const atStart = track.scrollLeft <= 2;
    const left = direction > 0 && atEnd ? -track.scrollLeft : direction < 0 && atStart ? track.scrollWidth : direction * cardStep() * 2;
    track.scrollBy({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!reducedMotion) timer = window.setInterval(() => move(1), 4500);
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateButtons, { passive: true });
  track.addEventListener('pointerenter', stop);
  track.addEventListener('pointerleave', start);
  track.addEventListener('focusin', stop);
  track.addEventListener('focusout', start);
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  });
  window.addEventListener('resize', updateButtons);
  updateButtons();
  start();
})();
