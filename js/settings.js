import { fromJS } from 'immutable';

import { field, updateField } from './fields';

const {
  TOGGLE_SETTINGS,
  FIELD_SAVE,
  FIELD_CHANGE
} = require('./actions');

const initialState = fromJS({
  speed: 2000,
  visible: false,
  folder: field('/Users/torgeir/Desktop/hww-bilder'),
  hashtag: field('#hessdalen')
});

const update = (state = initialState, action = {}) => {
  switch (action.type) {

  case TOGGLE_SETTINGS:
    return state.update('visible', visible => !visible);

  case FIELD_CHANGE:
  case FIELD_SAVE:
    return state.update(action.field, fieldState => updateField(fieldState, action));

  default:
    return state;
  }
};

const declare = (dispatch, state) => {

  const updateField = (field) => ({ target: { value } }) => dispatch(FIELD_CHANGE, { field, value });
  const saveField = (...fields) => () => {
    fields.map(field => dispatch(FIELD_SAVE, { field }));
    dispatch(TOGGLE_SETTINGS);
  };

  const view = <div>
    <input placeholder="Image folder"
           value={ state.getIn(['folder', 'value']) }
           onChange={ updateField('folder') } />

    <input placeholder="Hashtag"
           value={ state.getIn(['hashtag', 'value']) }
           onChange={ updateField('hashtag') } />

    <button onClick={ saveField('folder', 'hashtag') }>Ok</button>
  </div>;

  return { view };
};

export default { update, declare };
