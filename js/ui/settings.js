import { fromJS } from 'immutable';

import { field, updateField } from '../fields';
import styles from './settings.css';

const { SAVE_SETTINGS, TOGGLE_SETTINGS, FIELD_SAVE, FIELD_CHANGE, FIELD_RESET } = require('../actions');

const SETTINGS_KEY = 'hww-settings';

const settingsFromLocalStorage = (function () {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  }
  catch (e) {
    return {};
  }
})();

const pick = function (keys, state) {
  return keys.reduce(function (acc, key) {
    if (key in state) {
      acc[key] = state[key];
    }
    return acc;
  }, {});
};

const initialState = fromJS({
  shouldSave: false,
  visible: false,
  instaTimer: field(10),
  imageTimer: field(5),
  imagesBeforeInsta: field(3),
  folder: field('/Users/torgeir/Desktop/hww-bilder'),
  hashtag: field('#trondheim')
}).merge(
  pick(['instaTimer', 'imageTimer', 'imagesBeforeInsta', 'folder', 'hashtag'],
       settingsFromLocalStorage));

const update = (state = initialState, action = {}) => {
  switch (action.type) {

  case TOGGLE_SETTINGS:
    return state.merge({
      visible: !state.get('visible'),
      shouldSave: false
    });

  case SAVE_SETTINGS:
    return state.set('shouldSave', true);

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
    dispatch(SAVE_SETTINGS);
    dispatch(TOGGLE_SETTINGS);
  };

  const onFieldReset = (...fields) => () => {
    fields.forEach(field => dispatch(FIELD_RESET, { field }));
    dispatch(TOGGLE_SETTINGS);
  };

  const fields = ['folder', 'instaTimer', 'imageTimer', 'hashtag'];
  const saveFields = onFieldSave(...fields);
  const resetFields = onFieldReset(...fields);

  const onKeyDown = function ({ keyCode }) {
    if (keyCode == 13) { saveFields(); }
    if (keyCode == 27) { resetFields(); }
  };

  const view = <div className={ styles.settings }>
    <h2>Settings</h2>

    <label className={ styles.p }>Folder to watch for images in
    <input className={ `${styles.input}` }
           placeholder="Image folder"
           onKeyDown={ onKeyDown }
           value={ state.getIn(['folder', 'value']) }
           onChange={ onFieldChange('folder') } /></label>

    <label className={ styles.p }>Seconds to spend on each image in the folder
    <input className={ `${styles.input}` }
           placeholder="Image-timer (seconds)"
           onKeyDown={ onKeyDown }
           value={ state.getIn(['imageTimer', 'value']) }
           onChange={ onFieldChange('imageTimer') } /></label>

    <label className={ styles.p }>Seconds to spend showing instagram/twitter from swanscreen
    <input className={ `${styles.input}` }
           placeholder="Insta-timer (seconds)"
           onKeyDown={ onKeyDown }
           value={ state.getIn(['instaTimer', 'value']) }
           onChange={ onFieldChange('instaTimer') } /></label>

    <label className={ styles.p }>Number of images between showing instagram
    <input className={ `${styles.input}` }
           placeholder="images between insta"
           onKeyDown={ onKeyDown }
           value={ state.getIn(['imagesBeforeInsta', 'value']) }
           onChange={ onFieldChange('imagesBeforeInsta') } /></label>

    <label className={ styles.p }>Hashtag to show instagram/twitter
    <input className={ `${styles.input}` }
           placeholder="Hashtag"
           onKeyDown={ onKeyDown }
           value={ state.getIn(['hashtag', 'value']) }
           onChange={ onFieldChange('hashtag') } /></label>

    <button className={ styles.button }
            onClick={ saveFields }>Save</button>
  </div>;

  const keys = [{
    'enter': () => saveFields(),
    'esc': () => resetFields()
  }];

  const save = state.get('shouldSave')
        ? [{ key: SETTINGS_KEY, state }]
        : [];

  return { view, keys, save };
};

export default { update, declare };
