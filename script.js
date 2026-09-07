const clock = document.querySelector('#clock');
const tick = () => {
  clock.textContent = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date());
};
tick();
setInterval(tick, 1000);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const signalButton = document.querySelector('#signalButton');
signalButton.addEventListener('click', () => {
  const active = signalButton.getAttribute('aria-pressed') !== 'true';
  signalButton.setAttribute('aria-pressed', String(active));
  signalButton.lastChild.textContent = active ? ' SIGNAL ON' : ' SIGNAL OFF';
});
