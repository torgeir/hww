const actions = [
  'INIT',

  'PLAY',
  'PAUSE',
  'RAND',
  'SHOW_INSTA',

  'RESET',
  'FILES_ADDED',

  'SAVE_SETTINGS',
  'TOGGLE_SETTINGS',
  'SETTINGS_ACTION',
  'FIELD_SAVE',
  'FIELD_CHANGE',
  'FIELD_RESET'
].reduce(function (actions, type) {
  actions[type] = Symbol.for(type);
  return actions;
}, {});

module.exports = actions;
