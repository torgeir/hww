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

const select = (state) => ({
  visible: state.get('visible'),
  speed: state.get('speed'),
  folderText: state.get('folderText'),
  folder: state.get('folder')
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

const declare = (dispatch, { folderText }) => {

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

export default { select, update, declare };
