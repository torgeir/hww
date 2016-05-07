const fs = nodeRequire('fs'); // eslint-disable-line

import run from './run';
import render from './services/render';
import fetch from './services/fetch';
import watch from './services/watch';
import timer from './services/timer';
import keys from './services/keys';
import save from './services/save';

import debuggable from './ui/debuggable';
import app from './ui/app';

run(
  debuggable(app),
  [
    render(),
    fetch(),
    watch(),
    timer(),
    keys(),
    save()
  ]
);
