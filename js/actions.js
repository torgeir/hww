const actions = [
  'INIT',
  'PLAY',
  'PAUSE',
  'NEXT',
  'PREV',
  'RESET',
  'FILES_ADDED',
  'TOGGLE_SETTINGS',
  'SETTINGS_ACTION',
  'SWITCH_VIEW',
  'FIELD_SAVE',
  'FIELD_CHANGE'

].reduce(function (actions, type) {
  actions[type] = Symbol.for(type);
  return actions;
}, {});

module.exports = actions;
