const fs = nodeRequire('fs'); // eslint-disable-line

const INC = 'INC';
const GOT_IT = 'GOT_IT';
const AGAIN = 'AGAIN';
const DIDNT_GET_IT = 'DIDNT_GET_IT';

const initialState = {
  counter: 0,
  pending: 2,
  data: null
};

const update = (state, action) => {
  console.log('update', arguments);
  switch (action.type) {
    case AGAIN:
      return {
        counter: state.counter,
        data: state.data,
        pending: 2
      };
    case INC:
      return {
        counter: state.counter + 1
      };
    case GOT_IT:
      return {
        counter: state.counter + 1,
        data: action.data,
        pending: state.pending - 1
      };
    case DIDNT_GET_IT:
      return {
        counter: state.counter,
        data: action.error,
        pending: 0
      };
  }
  return state;
};

const declare = (dispatch, { counter, pending, data }) => {
  console.log('declare', arguments);
  return {

    view: <span>
      hei { counter }
      <button onClick={ () => dispatch(INC) }>up</button>
      <button onClick={ () => dispatch(AGAIN) }>again</button>
      data: { data }
    </span>,

    http: pending == 2
      ? [{
          key: 1,
          success: function (data) {
            dispatch(GOT_IT, { data });
          },
          error: function (error) {
            dispatch(DIDNT_GET_IT, { error });
          }
        },{
          key: 2,
          success: function (data) {
            dispatch(GOT_IT, { data });
          },
          error: function (error) {
            dispatch(DIDNT_GET_IT, { error });
          }
        }]
      : []
  };
}

import run from './elmish';
import render from './services/render';
import fetch from './services/fetch';

run(App, [render, fetch]);
