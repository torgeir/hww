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
  TOGGLE_SETTINGS,
  SWITCH_VIEW
} = require('./actions');

const initialState = fromJS({
  images: [],
  currentImage: null,
  paused: false,
  settings: Settings.update(),
  showInstagram: false
});

const update = (state = initialState, action) => {
  switch (action.type) {

  case INIT:
    return state;

  case SWITCH_VIEW:
    return state.update('showInstagram', showInstagram => !showInstagram);

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
  const showInstagram = state.get('showInstagram');
  const paused = state.get('paused');

  const images = state.get('images');
  const src = images.get(state.get('currentImage'));

  const settings = state.get('settings');
  const folder = settings.getIn(['folder', 'text']);

  const onPlayPause = () => dispatch(paused ? PLAY : PAUSE);

  const nextImageTimer = {
    key: 'next-image-timer',
    time: 2,
    onTick: function () {
      dispatch(NEXT);
    }
  };

  const switchViewTimer = {
    key: 'change-view-timer',
    time: 6,
    onTick: function () {
      dispatch(SWITCH_VIEW);
    }
  };

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

      const iframeStyles = {
        border: 0,
        width: '100%',
        height: '100%',
        display: showInstagram ? 'block' : 'none'
      };

      const imageStyles = {
        display: showInstagram ? 'none' : 'block'
      };

      const hashtag = settings.getIn(['hashtag', 'text']).replace('#', '');

      return <div style={ s }>
        { state.getIn(['settings', 'hashtag', 'text']) }
        { settingsPanel }
        <button onClick={ onPlayPause }>
          play/pause
        </button>
        <iframe style={ iframeStyles } src={ `http://swanscreen.com/show.php?tag=${hashtag}` } />;
        <Image style={ imageStyles } src={ src } />
      </div>;
    },

    timer:
      (paused || images.count() == 0)
      ? []
      : (showInstagram)
        ? [switchViewTimer]
        : [nextImageTimer, switchViewTimer],

    watch: folder == null
      ? {}
      : {
        folder: folder,
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
