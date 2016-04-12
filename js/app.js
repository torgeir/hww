const nativeImage = nodeRequire('electron').nativeImage; // eslint-disable-line

import { fromJS } from 'immutable';

import style from './style';
import Image from './image';
import Settings from './settings';

const {
  INIT,
  PLAY,
  PAUSE,
  NEXT,
  RESET,
  FILES_ADDED,
  SETTINGS_ACTION,
  TOGGLE_SETTINGS
} = require('./actions');

const initialState = fromJS({
  images: [],
  currentImage: null,
  paused: false,
  settings: Settings.update()
});

const update = (state = initialState, action) => {
  switch (action.type) {

  case INIT:
    return state;

  case FILES_ADDED:
    return state.update('images', (images) => images.concat(action.files));

  case PLAY:
    return state.set('paused', false);

  case PAUSE:
    return state.set('paused', true);

  case RESET:
    return state.merge({
      currentImage: null,
      images: []
    });

  case NEXT: {
    const images = state.get('images');
    if (images.isEmpty()) {
      return state;
    }

    const currentImage = state.get('currentImage') || 0;
    const nextImage = currentImage + 1;
    if (nextImage == images.count()) {
      return state.set('currentImage', 0);
    }

    return state.set('currentImage', nextImage);
  }

  case SETTINGS_ACTION:
    return state.update('settings', settings => Settings.update(settings, action.action));

  default:
    return state;
  }
};

const declare = (dispatch, state) => {

  const paused = state.get('paused');
  const images = state.get('images');
  const src = images.get(state.get('currentImage'));
  const settings = state.get('settings');

  const settingsDispatch = (type, data) => dispatch(SETTINGS_ACTION, { action: { type, ...data } });
  const settingsEffects = settings.get('visible')
          ? Settings.declare(settingsDispatch, settings)
          : null;

  const onShowSettings = () => dispatch(SETTINGS_ACTION, { action: { type: TOGGLE_SETTINGS } });

  const settingsPanel = <div>
    { settingsEffects && settingsEffects.view }
    <button onClick={ onShowSettings }>
      show settings
    </button>
  </div>;

  const onPlayPause = () => dispatch(paused ? PLAY : PAUSE);

  return {

    view: function () {

      if (!src) {
        return <div>
          { settingsPanel }
          <span>No image</span>
        </div>;
      }

      const s =
        style.height('100%',
        style.backgroundColor("#333"));

      return <div style={ s }>
        { settingsPanel }
        <button onClick={ onPlayPause }>
          play/pause
        </button>
        <Image src={ src } />
      </div>;
    },

    timer: (paused || images.count() == 0)
      ? []
      : [{
          key: 'next-image-timer',
          time: 2,
          onTick: function () {
            dispatch(NEXT);
          }
         }, {
          key: 'change-view-timer',
          time: 6,
          onTick: function () {
            console.log('every 6');
          }
         }],

    watch: settings.get('folder') == null
      ? {}
      : {
        folder: settings.get('folder'),
        onReset: () => {
          dispatch(RESET);
        },
        onChange: (files) => {
          dispatch(FILES_ADDED, { files });

          if (!src) {
            dispatch(NEXT);
          }
        }
      }
  };
};
export default { update, declare };
