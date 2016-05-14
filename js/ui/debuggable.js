export default function debuggable (Component) {

  const update = function (state, action) {
    return Component.update(state, action);
  };

  const declare = function (dispatch, state) {
    const loggingDispatch = function (type, data) {
      console.log('dispatching', type, data); // eslint-disable-line
      return dispatch(type, data);
    };
    return Component.declare(loggingDispatch, state);
  };

  return { update, declare };
}
