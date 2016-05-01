const nativeImage = nodeRequire('electron').nativeImage; // eslint-disable-line

import { fromJS } from 'immutable';

import styles from './app.css';
import Settings from './settings';
import Icon from '../components/icon';
import Image from '../components/image';

const { INIT, PLAY, PAUSE, RAND, RESET, FILES_ADDED, SETTINGS_ACTION, TOGGLE_SETTINGS, SHOW_INSTA } = require('../actions');

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
  const isCurrentImageInstagram = (currentImage == 'insta');
  const imagesBeforeInsta = state.get('imagesBeforeInsta');

  const queue = state.get('queue');
  const images = state.get('images');
  const isPaused = state.get('paused');
  const src = images.get(currentImage);

  const settings = state.get('settings');
  const folder = settings.getIn(['folder', 'text']);
  const hashtag = settings.getIn(['hashtag', 'text']).replace('#', '');
  const isFolderNotSet = (folder == null);
  const isSettingsVisible = settings.get('visible');

  const settingsDispatch = (type, data) => dispatch(SETTINGS_ACTION, { action: { type, ...data } });
  const settingsEffects = isSettingsVisible ? Settings.declare(settingsDispatch, settings) : {};
  const dispatchToggleSettings = () => dispatch(SETTINGS_ACTION, { action: { type: TOGGLE_SETTINGS } });
  const settingsPanel = <div className={ styles.settings }>
    <a className={ styles.cog }
       onClick={ dispatchToggleSettings } >
      <Icon size="32" name="cog" color="#fefefe" />
    </a>
    { settingsEffects.view }
  </div>;

  const dispatchShowNextImage = () => dispatch((imagesBeforeInsta == 0) ? SHOW_INSTA : RAND);

  const nextImageTimer = {
    key: 'next-image-timer',
    onTick: () => dispatchShowNextImage(),
    time: settings.getIn([isCurrentImageInstagram ? 'instaTimer' : 'imageTimer', 'text'])
  };

  const view = function () {
    if (!isCurrentImageInstagram && !src) {
      return <div className={ styles.app }>
        { settingsPanel }
        <div className={ styles.display }>No images found in folder { folder }</div>
      </div>;
    }

    const iframeStyles = {
      display: isCurrentImageInstagram ? 'block' : 'none',
      width: '100%',
      border: 0,
      flex: 1
    };

    const imageStyles = {
      display: isCurrentImageInstagram ? 'none' : 'block'
    };

    return <div className={ styles.app }>
        { settingsPanel }
        <div className={ styles.display }>
          <iframe style={ iframeStyles } src={ `http://swanscreen.com/show.php?tag=${hashtag}` } />
          <Image style={ imageStyles } src={ src } />
        </div>
    </div>;
  };

  const keys = [{
    'cmd ,': () => dispatchToggleSettings(),
    'enter': () => dispatchShowNextImage(),
    'space': () => dispatch(isPaused ? PLAY : PAUSE)
  }].concat(settingsEffects.keys || []);

  const isImagesEmpty = (images.count() == 0 && queue.count() == 0);
  const timer = (isPaused || isFolderNotSet || isImagesEmpty)
    ? []
    : [nextImageTimer];

  const watch = isFolderNotSet
    ? {}
    : {
        folder,
        onReset: () => dispatch(RESET),
        onChange: function (files) {
          dispatch(FILES_ADDED, { files });

          const shouldAutoStart = (!isCurrentImageInstagram && !src);
          if (shouldAutoStart) {
            dispatch(RAND);
          }
        }
      };

  return { view, keys, timer, watch };
};

export default { update, declare };
