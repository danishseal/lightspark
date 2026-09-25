const form = document.getElementById('subscribe-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.getElementById('subscribe-message');
  if (message) message.textContent = 'Subscription is unavailable in this local copy.';
});
