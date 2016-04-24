const timer = () => {

  const currentTimers = {};

  const removeTimer = function (key) {
    clearTimeout(currentTimers[key]);
    delete currentTimers[key];
  };

  return function ({ timer = [] }) {
    const previousTimerKeys = Object.keys(currentTimers);
    const newTimerKeys = timer.map(t => t.key);
    const staleTimerKeys = previousTimerKeys.filter(key => newTimerKeys.indexOf(key) == -1);
    staleTimerKeys.forEach(removeTimer);

    timer.forEach(function ({ key, time, onTick }) {
      const isNewTimer = !(key in currentTimers);
      if (isNewTimer) {
        if (typeof time == 'number' && typeof onTick == 'function') {
          currentTimers[key] = setTimeout(function () {
            delete currentTimers[key];
            onTick();
          }, time * 1000);
        }
      }
    });
  };
};


export default timer;
