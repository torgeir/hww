import { fromJS } from 'immutable';

import { field, updateField } from '../fields';

const {
  TOGGLE_SETTINGS,
  FIELD_SAVE,
  FIELD_CHANGE,
  FIELD_RESET
} = require('../actions');

const initialState = fromJS({
  visible: false,
  instaTimer: field(10),
  imageTimer: field(2),
  folder: field('/Users/torgeir/Desktop/hww-bilder'),
  hashtag: field('#trondheim')
});

const update = (state = initialState, action = {}) => {
  switch (action.type) {

  case TOGGLE_SETTINGS:
    return state.update('visible', (visible) => !visible);

  case FIELD_CHANGE:
  case FIELD_SAVE:
  case FIELD_RESET:
    return state.update(action.field, updateField(action));

  default:
    return state;
  }
};

const declare = (dispatch, state) => {

  const onFieldChange = (field) => ({ target: { value } }) =>
    dispatch(FIELD_CHANGE, {
      field,
      value: /^[0-9]+$/.test(value) ? Number(value) : String(value)
    });

  const onFieldSave = (...fields) => () => {
    fields.forEach(field => dispatch(FIELD_SAVE, { field }));
    dispatch(TOGGLE_SETTINGS);
  };

  const onFieldReset = (...fields) => () => {
    fields.forEach(field => dispatch(FIELD_RESET, { field }));
    dispatch(TOGGLE_SETTINGS);
  };


  const settingsStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#fefefe',
    fontSize: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  };

  const inputStyles = {
    fontSize: '2rem',
    width: '100%',
    padding: '0.5rem'
  };

  const buttonStyles = {
    fontSize: '2rem'
  };

  const fields = ['folder', 'instaTimer', 'imageTimer', 'hashtag'];
  const saveFields = onFieldSave(...fields);
  const resetFields = onFieldReset(...fields);
  const handleKeys = function ({ keyCode }) {
    switch (keyCode) {
    case 13:
      return saveFields();
    case 27:
      return resetFields();
    default:
      return false;
    }
  };

  const view = <div style={ settingsStyles }>

    <p>Folder to watch for images in</p>
    <input style={ inputStyles }
           placeholder="Image folder"
           value={ state.getIn(['folder', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('folder') } />

    <p>Seconds to spend on each image</p>
    <input style={ inputStyles }
           placeholder="Image-timer"
           value={ state.getIn(['imageTimer', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('imageTimer') } />

    <p>Seconds to spend showing instagram/twitter</p>
    <input style={ inputStyles }
           placeholder="Insta-timer"
           value={ state.getIn(['instaTimer', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('instaTimer') } />

    <p>Hashtag to show instagram/twitter</p>
    <input style={ inputStyles }
           placeholder="Hashtag"
           value={ state.getIn(['hashtag', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('hashtag') } />

    <p>
      <button style={ buttonStyles }
              onClick={ saveFields }>Ok</button>
    </p>
  </div>;

  const keys = { 'esc': () => resetFields() };

  return { view, keys };
};

export default { update, declare };
