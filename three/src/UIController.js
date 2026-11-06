export class UIController {
  constructor(model, start, stop) {
    this.status = document.querySelector('#status');
    this.start = document.querySelector('#start');
    this.exit = document.querySelector('#exit');
    const panel = document.querySelector('#panel');
    panel.addEventListener('beforexrselect', event => event.preventDefault());
    document.querySelector('#model').onchange = e => model.setModel(e.target.value);
    document.querySelector('#color').oninput = e => model.setColor(e.target.value);
    document.querySelector('#left').onclick = () => model.rotate(-Math.PI / 12);
    document.querySelector('#right').onclick = () => model.rotate(Math.PI / 12);
    const spin = document.querySelector('#spin');
    spin.onclick = () => {
      model.autoRotate = !model.autoRotate;
      spin.setAttribute('aria-pressed', String(model.autoRotate));
      spin.textContent = model.autoRotate ? 'Остановить' : 'Автовращение';
    };
    document.querySelector('#reset').onclick = () => {
      model.reset();
      document.querySelector('#model').value = 'cube';
      document.querySelector('#color').value = '#2196f3';
      spin.setAttribute('aria-pressed', 'false');
      spin.textContent = 'Автовращение';
    };
    this.start.onclick = () => start();
    this.exit.onclick = () => stop();
  }
  message(text) { this.status.textContent = text; }
  setAR(active) {
    this.start.hidden = active;
    this.exit.hidden = !active;
    document.querySelector('#place').hidden = !active;
  }
}
