import { fromJS } from 'immutable';

const {
  FIELD_SAVE,
  FIELD_CHANGE
} = require('./actions');

export const field = (value) =>
  updateField(
    updateField(undefined, { type: FIELD_CHANGE, value }),
    { type: FIELD_SAVE });

export const updateField = (state = fromJS({ text: '', value: '' }), action) => {
  switch (action.type) {
  case FIELD_CHANGE:
    return state.update('value', (value) => action.value);
  case FIELD_SAVE:
    return state.set('text', state.get('value'));
  default:
    return state;
  }
};
