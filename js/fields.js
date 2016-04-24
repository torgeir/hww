import { fromJS } from 'immutable';

const {
  FIELD_SAVE,
  FIELD_CHANGE,
  FIELD_RESET
} = require('./actions');

export const field = (value) =>
  updateField({ type: FIELD_SAVE })(
    updateField({ type: FIELD_CHANGE, value })(undefined));

export const updateField = (action) => function (state = fromJS({ text: '', value: '' })) {
  switch (action.type) {
  case FIELD_CHANGE:
    return state.set('value', action.value);
  case FIELD_SAVE:
    return state.set('text', state.get('value'));
  case FIELD_RESET:
    return state.set('value', state.get('text'));
  default:
    return state;
  }
};