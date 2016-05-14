const ReactDom = require('react-dom');

const el = document.querySelector('.app-root');

const render = () => ({ view }) =>
  ReactDom.render(typeof view == 'function' ? view() : view, el);

export default render;
