const actions = [
  'INIT',
  'INC',
  'PLAY',
  'PAUSE',
  'NEXT',
  'PREV',
  'RESET',
  'FILES_ADDED',
  'TOGGLE_SETTINGS',
  'SETTINGS_ACTION',
  'SET_FOLDER_TEXT',
  'SET_FOLDER',
  'SWITCH_VIEW'
].reduce(function (actions, type) {
  actions[type] = Symbol.for(type);
  return actions;
}, {});

module.exports = actions;
