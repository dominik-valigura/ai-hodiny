(function () {
  const server = window.__SERVER_TIME__ || { h: 0, m: 0, s: 0, ms: 0, epochMs: Date.now(), tzOffsetMin: 0 };
  const offset = server.epochMs - Date.now();
  const tzOffsetMin = Number(server.tzOffsetMin) || 0;

  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  const secondHand = document.getElementById('second-hand');
  const readout = document.getElementById('time-readout');

  function buildTicks() {
    const minuteTicks = document.getElementById('minute-ticks');
    const hourTicks = document.getElementById('hour-ticks');
    const hourNumbers = document.getElementById('hour-numbers');
    const cx = 100, cy = 100;

    for (let i = 0; i < 60; i++) {
      const angle = (i * 6) * Math.PI / 180;
      const isHour = i % 5 === 0;
      const rOuter = 92;
      const rInner = isHour ? 82 : 87;
      const x1 = cx + rInner * Math.sin(angle);
      const y1 = cy - rInner * Math.cos(angle);
      const x2 = cx + rOuter * Math.sin(angle);
      const y2 = cy - rOuter * Math.cos(angle);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', isHour ? 'tick hour' : 'tick');
      (isHour ? hourTicks : minuteTicks).appendChild(line);
    }

    for (let n = 1; n <= 12; n++) {
      const angle = (n * 30) * Math.PI / 180;
      const r = 72;
      const x = cx + r * Math.sin(angle);
      const y = cy - r * Math.cos(angle);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('class', 'hour-number');
      text.textContent = String(n);
      hourNumbers.appendChild(text);
    }
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const serverLocal = new Date(Date.now() + offset + tzOffsetMin * 60000);
    const ms = serverLocal.getUTCMilliseconds();
    const seconds = serverLocal.getUTCSeconds() + ms / 1000;
    const minutes = serverLocal.getUTCMinutes() + seconds / 60;
    const hours = serverLocal.getUTCHours() + minutes / 60;

    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6;
    const hourDeg = (hours % 12) * 30;

    secondHand.style.transform = `rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;

    if (readout) {
      readout.textContent = `${pad2(serverLocal.getUTCHours())}:${pad2(serverLocal.getUTCMinutes())}:${pad2(serverLocal.getUTCSeconds())}`;
    }

    requestAnimationFrame(update);
  }

  buildTicks();
  update();
})();
