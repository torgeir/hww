const timer = () => {

  let timing, onTick;

  return ({ timer }) => {
    const { time } = timer;
    onTick = timer.onTick;

    if (!timing) {
      timing = true;

      (function loop() {
        if (typeof time == 'number' && typeof onTick == 'function') {
          onTick();
          setTimeout(loop, time * 1000);
        }
        else {
          timing = false;
        }
      })();
    }
  };
};


export default timer;
