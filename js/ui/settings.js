import { fromJS } from 'immutable';

import { field, updateField } from '../fields';
import styles from './settings.css';

const { TOGGLE_SETTINGS, FIELD_SAVE, FIELD_CHANGE, FIELD_RESET } = require('../actions');

const initialState = fromJS({
  visible: false,
  instaTimer: field(10),
  imageTimer: field(5),
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

  const fields = ['folder', 'instaTimer', 'imageTimer', 'hashtag'];
  const saveFields = onFieldSave(...fields);
  const resetFields = onFieldReset(...fields);

  const view = <div className={ styles.settings }>
    <h2>Settings</h2>

    <label className={ styles.p }>Folder to watch for images in
    <input className={ `${styles.input} with-hotkeys` }
           placeholder="Image folder"
           value={ state.getIn(['folder', 'value']) }
           onChange={ onFieldChange('folder') } /></label>

    <label className={ styles.p }>Seconds to spend on each image in the folder
    <input className={ `${styles.input} with-hotkeys` }
           placeholder="Image-timer (seconds)"
           value={ state.getIn(['imageTimer', 'value']) }
           onChange={ onFieldChange('imageTimer') } /></label>

    <label className={ styles.p }>Seconds to spend showing instagram/twitter from swanscreen
    <input className={ `${styles.input} with-hotkeys` }
           placeholder="Insta-timer (seconds)"
           value={ state.getIn(['instaTimer', 'value']) }
           onChange={ onFieldChange('instaTimer') } /></label>

    <label className={ styles.p }>Hashtag to show instagram/twitter
    <input className={ `${styles.input} with-hotkeys` }
           placeholder="Hashtag"
           value={ state.getIn(['hashtag', 'value']) }
           onChange={ onFieldChange('hashtag') } /></label>

    <button className={ styles.button }
            onClick={ saveFields }>Save</button>
  </div>;

  const keys = [{
    'enter': () => saveFields(),
    'esc': () => resetFields()
  }];

  return { view, keys };
};

export default { update, declare };
