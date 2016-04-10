const { INIT } = require('./actions');

export default function run (Component, services = []) {

  const stateSelector = (state) =>
    typeof Component.select == 'function'
      ? Component.select(state)
      : state;

  let isThrottled = false;
  const throttled = (fn) => {
    isThrottled = true;
    fn();
    isThrottled = false;
  };

  let state;

  const dispatch = (type, data) => {
    state = window.state = Component.update(state, { type, ...data });
    if (!isThrottled) {
      const effects = Component.declare(dispatch, stateSelector(state));
      services.forEach(service => service(effects, throttled));
    }
  };

  dispatch(INIT);

  return { state, dispatch };

}
