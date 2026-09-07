const canvas = document.querySelector('#dust');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 12)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.3,
    speed: 0.08 + Math.random() * 0.22,
  }));
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = '#d7ff3f';
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    if (particle.y < 0) particle.y = window.innerHeight;
    ctx.globalAlpha = 0.15 + particle.size / 4;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  });
  requestAnimationFrame(draw);
}

const soundButton = document.querySelector('.sound-toggle');
soundButton.addEventListener('click', () => {
  const label = soundButton.querySelector('span');
  label.textContent = label.textContent === 'OFF' ? 'ON' : 'OFF';
});

window.addEventListener('resize', resize);
resize();
draw();
