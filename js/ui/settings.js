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

  const pStyles = {
    fontFamily: 'Helvetica',
    fontSize: '2rem',
    padding: '1rem',
    marginBottom: '0rem',
    width: '100%',
    boxSizing: 'border-box'
  };

  const inputStyles = {
    fontFamily: 'Helvetica',
    fontSize: '2rem',
    width: '100%',
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    boxSizing: 'border-box'
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

    <label style={ pStyles }>Folder to watch for images in
    <input style={ inputStyles }
           placeholder="Image folder"
           value={ state.getIn(['folder', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('folder') } /></label>

    <label style={ pStyles }>Seconds to spend on each image
    <input style={ inputStyles }
           placeholder="Image-timer"
           value={ state.getIn(['imageTimer', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('imageTimer') } /></label>

    <label style={ pStyles }>Seconds to spend showing instagram/twitter
    <input style={ inputStyles }
           placeholder="Insta-timer"
           value={ state.getIn(['instaTimer', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('instaTimer') } /></label>

    <label style={ pStyles }>Hashtag to show instagram/twitter
    <input style={ inputStyles }
           placeholder="Hashtag"
           value={ state.getIn(['hashtag', 'value']) }
           onKeyDown={ handleKeys }
           onChange={ onFieldChange('hashtag') } /></label>

      <button style={ buttonStyles }
              onClick={ saveFields }>Save</button>
  </div>;
  const keys = { 'esc': () => resetFields() };

  return { view, keys };
};

export default { update, declare };
