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
const signalLabel = signalButton.querySelector('.signal-label');
let audioContext;
let signalNodes;

const createSignal = () => {
  const output = audioContext.createGain();
  const carrier = audioContext.createOscillator();
  const undertone = audioContext.createOscillator();
  const pulse = audioContext.createOscillator();
  const pulseDepth = audioContext.createGain();

  carrier.type = 'sine';
  carrier.frequency.value = 174;
  undertone.type = 'triangle';
  undertone.frequency.value = 87;
  pulse.type = 'sine';
  pulse.frequency.value = 0.18;
  pulseDepth.gain.value = 0.018;
  output.gain.value = 0;

  carrier.connect(output);
  undertone.connect(output);
  pulse.connect(pulseDepth).connect(output.gain);
  output.connect(audioContext.destination);
  carrier.start();
  undertone.start();
  pulse.start();

  return { output, oscillators: [carrier, undertone, pulse] };
};

const setButtonState = (active) => {
  signalButton.setAttribute('aria-pressed', String(active));
  signalButton.setAttribute('aria-label', active ? '배경 신호음 끄기' : '배경 신호음 켜기');
  signalLabel.textContent = active ? 'SIGNAL ON' : 'SIGNAL OFF';
};

signalButton.addEventListener('click', async () => {
  const active = signalButton.getAttribute('aria-pressed') !== 'true';

  if (active) {
    audioContext ||= new AudioContext();
    await audioContext.resume();
    signalNodes = createSignal();
    signalNodes.output.gain.linearRampToValueAtTime(0.035, audioContext.currentTime + 0.6);
    setButtonState(true);
    return;
  }

  const nodesToStop = signalNodes;
  signalNodes = null;
  nodesToStop.output.gain.cancelScheduledValues(audioContext.currentTime);
  nodesToStop.output.gain.setValueAtTime(nodesToStop.output.gain.value, audioContext.currentTime);
  nodesToStop.output.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
  nodesToStop.oscillators.forEach((oscillator) => oscillator.stop(audioContext.currentTime + 0.2));
  setButtonState(false);
});
