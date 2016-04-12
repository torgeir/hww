const timer = () => {

  const timers = {};

  const removeTimer = (key) => {
    clearTimeout(timers[key]);
    delete timers[key];
  };

  return (effects, throttled) => {
    const previousTimerKeys = Object.keys(timers);
    const newTimerKeys = effects.timer.map(timer => timer.key);
    const staleTimerKeys = previousTimerKeys.filter(key => newTimerKeys.indexOf(key) == -1);
    staleTimerKeys.forEach(key => removeTimer(key));

    effects.timer.forEach(({ key, time, onTick }) => {
      const isNewTimer = !(key in timers);
      if (isNewTimer) {
        (function loop() {
          if (typeof time == 'number' && typeof onTick == 'function') {
            const isFirstOnTick = !timers[key];
            if (isFirstOnTick) {
                throttled(() => onTick());
            }
            else {
              onTick();
            }
            timers[key] = setTimeout(loop, time * 1000);
          }
        })();
      }
    });
  };
};


export default timer;