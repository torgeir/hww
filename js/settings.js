import { fromJS } from 'immutable';

const {
  TOGGLE_SETTINGS,
  SET_FOLDER,
  SET_FOLDER_TEXT
} = require('./actions');

const initialState = fromJS({
  speed: 2000,
  visible: false,
  folderText: '',
  folder: null
});

const update = (state = initialState, action = {}) => {
  switch (action.type) {

  case TOGGLE_SETTINGS:
    return state.update('visible', visible => !visible);

  case SET_FOLDER:
    return state.set('folder', state.get('folderText'));

  case SET_FOLDER_TEXT:
    return state.set('folderText', action.folder);

  default:
    return state;
  }
};

const declare = (dispatch, state) => {

  const visible = state.get('visible');
  const speed = state.get('speed');
  const folderText = state.get('folderText');
  const folder = state.get('folder');

  const updateFolderText = ({ target: { value } }) => dispatch(SET_FOLDER_TEXT, { folder: value });

  const setFolder = () => {
    dispatch(SET_FOLDER);
    dispatch(TOGGLE_SETTINGS);
  };

  const view = <div>
    <input placeholder="Image folder"
           value={ folderText }
           onChange={ updateFolderText } />
    <button onClick={ setFolder }>
      ok
    </button>
  </div>;

  return { view };
};

export default { update, declare };
