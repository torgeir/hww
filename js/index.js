const fs = nodeRequire('fs'); // eslint-disable-line

import run from './run';
import render from './services/render';
import fetch from './services/fetch';
import watch from './services/watch';
import timer from './services/timer';

import App from './app';

run(App, [
  render(),
  fetch(),
  watch(),
  timer()
]);
