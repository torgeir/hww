
const save = function () {

  const previousStates = {};

  return function ({ save = [] }) {

    save.forEach(function (keyAndState) {
      const { key, state } = keyAndState;

      const previousState = previousStates[key];
      if (state != previousState) {
        previousStates[key] = state;
        localStorage.setItem(key, JSON.stringify(state.toJS()));
      }
    });
  };
};

export default save;
