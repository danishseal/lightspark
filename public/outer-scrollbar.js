(() => {
  const track = document.createElement('div');
  track.className = 'outer-scrollbar';
  track.setAttribute('role', 'scrollbar');
  track.setAttribute('aria-label', 'Page scrollbar');
  track.setAttribute('aria-orientation', 'vertical');
  track.tabIndex = 0;
  const thumb = document.createElement('div');
  thumb.className = 'outer-scrollbar__thumb';
  track.appendChild(thumb);
  document.body.appendChild(track);

  let dragging = false;
  let dragOffset = 0;
  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const thumbHeight = () => Math.min(140, Math.max(80, window.innerHeight * 0.16));

  function update() {
    const max = maxScroll();
    track.hidden = max < 2;
    if (track.hidden) return;
    const height = thumbHeight();
    const travel = Math.max(0, track.clientHeight - height);
    thumb.style.height = `${height}px`;
    thumb.style.transform = `translateY(${max ? window.scrollY / max * travel : 0}px)`;
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', String(Math.round(max)));
    track.setAttribute('aria-valuenow', String(Math.round(window.scrollY)));
  }

  function scrollFromPointer(clientY, offset = thumbHeight() / 2) {
    const travel = Math.max(1, track.clientHeight - thumbHeight());
    const y = Math.max(0, Math.min(travel, clientY - track.getBoundingClientRect().top - offset));
    window.scrollTo({ top: y / travel * maxScroll(), behavior: 'instant' });
  }

  track.addEventListener('pointerdown', event => {
    dragging = true;
    dragOffset = event.target === thumb ? event.clientY - thumb.getBoundingClientRect().top : thumbHeight() / 2;
    track.setPointerCapture(event.pointerId);
    scrollFromPointer(event.clientY, dragOffset);
    event.preventDefault();
  });
  track.addEventListener('pointermove', event => {
    if (dragging) scrollFromPointer(event.clientY, dragOffset);
  });
  track.addEventListener('pointerup', () => { dragging = false; });
  track.addEventListener('pointercancel', () => { dragging = false; });
  track.addEventListener('keydown', event => {
    const amount = event.key === 'ArrowDown' ? 60 : event.key === 'ArrowUp' ? -60 : event.key === 'PageDown' ? window.innerHeight * .8 : event.key === 'PageUp' ? -window.innerHeight * .8 : null;
    if (amount !== null) { window.scrollBy({ top: amount }); event.preventDefault(); }
    if (event.key === 'Home') { window.scrollTo(0, 0); event.preventDefault(); }
    if (event.key === 'End') { window.scrollTo(0, maxScroll()); event.preventDefault(); }
  });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  new ResizeObserver(update).observe(document.body);
  update();
})();
