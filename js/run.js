const { INIT } = require('./actions');

export default function run (Component, services = []) {

  let isThrottled = false;
  const throttled = function (fn) {
    isThrottled = true;
    fn();
    isThrottled = false;
  };

  let state;

  const dispatch = function (type, data) {
    state = window.state = Component.update(state, { type, ...data });
    if (!isThrottled) {
      const effects = Component.declare(dispatch, state);
      services.forEach(service => service(effects, throttled));
    }
  };

  dispatch(INIT);

  return { state, dispatch };

}
