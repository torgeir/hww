const nativeImage = nodeRequire('electron').nativeImage; // eslint-disable-line

import { fromJS } from 'immutable';

import Icon from '../components/icon';
import Image from '../components/image';
import Settings from './settings';

const {
  INIT,
  PLAY,
  PAUSE,
  RAND,
  RESET,
  FILES_ADDED,
  SETTINGS_ACTION,
  TOGGLE_SETTINGS,
  SHOW_INSTA
} = require('../actions');

const initialState = fromJS({
  imagesBeforeInsta: 3,
  images: [],
  queue: [],
  currentImage: null,
  paused: false,
  settings: Settings.update()
});

const update = function (state = initialState, action) {
  switch (action.type) {

  case INIT:
    return state;

  case FILES_ADDED:
    return state.update('queue', (queue) => queue.concat(action.files));

  case PLAY:
    return state.set('paused', false);

  case PAUSE:
    return state.set('paused', true);

  case RESET:
    return state.merge({
      images: [],
      queue: [],
      currentImage: null,
      imagesBeforeInsta: initialState.get('imagesBeforeInsta')
    });

  case SHOW_INSTA:
    return state.merge({
      currentImage: 'insta',
      imagesBeforeInsta: initialState.get('imagesBeforeInsta') + 1
    });

  case RAND: {
    const images = state.get('images');

    const queue = state.get('queue');
    const queuedImage = queue.first();
    if (queuedImage) {
      const updatedImages = images.push(queuedImage);
      const currentImage = updatedImages.count() - 1;
      return state.merge({
        images: updatedImages,
        queue: queue.skip(1),
        currentImage,
        imagesBeforeInsta: state.get('imagesBeforeInsta') - 1
      });
    }

    const randUntil = function (pred) {
      const rand = () => parseInt(Math.random() * images.count(), 10);
      let num = rand();
      while (!pred(num)) {
        num = rand();
      }
      return num;
    };

    const imagesBeforeInsta = state.get('imagesBeforeInsta') - 1;
    return state.merge({
      currentImage: randUntil((n) => n != state.get('currentImage')),
      imagesBeforeInsta
    });
  }

  case SETTINGS_ACTION:
    return state.update('settings', (settings) => Settings.update(settings, action.action));

  default:
    return state;
  }
};

const declare = function (dispatch, state) {
  const currentImage = state.get('currentImage');

  const imagesBeforeInsta = state.get('imagesBeforeInsta');
  const showInstagram = currentImage == 'insta';

  const paused = state.get('paused');

  const images = state.get('images');
  const src = images.get(currentImage);

  const queue = state.get('queue');

  const settings = state.get('settings');
  const folder = settings.getIn(['folder', 'text']);
  const hashtag = settings.getIn(['hashtag', 'text']).replace('#', '');

  const dispatchShowNextImage = () => dispatch((imagesBeforeInsta == 0) ? SHOW_INSTA : RAND);

  const settingsDispatch = (type, data) => dispatch(SETTINGS_ACTION, { action: { type, ...data } });
  const settingsEffects = settings.get('visible') ? Settings.declare(settingsDispatch, settings) : null;

  const onShowSettings = () => dispatch(SETTINGS_ACTION, { action: { type: TOGGLE_SETTINGS } });

  const settingsStyles = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1
  };

  const cogStyles = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    cursor: 'pointer'
  };

  const settingsPanel = <div style={ settingsStyles }>
    <a className="settingsCog"
       onClick={ onShowSettings }
       style={ cogStyles }>
      <Icon size="32"
            name="cog"
            color="#fefefe" />
    </a>
    { settingsEffects && settingsEffects.view }
  </div>;

  const nextImageTimer = {
    key: 'next-image-timer',
    time: showInstagram ? settings.getIn(['instaTimer', 'text']) : settings.getIn(['imageTimer', 'text']),
    onTick: () => dispatchShowNextImage()
  };

  return {

    view: function () {
      if (!showInstagram && !src) {
        return <div>
          { settingsPanel }
          <span>No image</span>
        </div>;
      }

      const appStyles = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      };

      const displayStyles = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      };

      const iframeStyles = {
        display: showInstagram ? 'block' : 'none',
        width: '100%',
        border: 0,
        flex: 1
      };

      const imageStyles = {
        display: showInstagram ? 'none' : 'block'
      };

      return <div style={ appStyles }>
        { settingsPanel }
        <div style={ displayStyles }>
          <iframe style={ iframeStyles } src={ `http://swanscreen.com/show.php?tag=${hashtag}` } />
          <Image style={ imageStyles } src={ src } />
        </div>
      </div>;
    },

    keys: Object.assign({}, {
      'backspace': () => onShowSettings(),
      'space': () => dispatch(paused ? PLAY : PAUSE),
      'enter': () => dispatchShowNextImage()
    }, settingsEffects && settingsEffects.keys),

    timer: (paused || folder == null || (images.count() == 0 && queue.count() == 0))
      ? []
      : [nextImageTimer],

    watch: folder == null
      ? {}
      : {
        folder,
        onReset: () => dispatch(RESET),
        onChange: function (files) {
          dispatch(FILES_ADDED, { files });

          if (!showInstagram && !src) {
            dispatch(RAND);
          }
        }
      }
  };
};
export default { update, declare };
