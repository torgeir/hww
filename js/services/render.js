const ReactDom = require('react-dom');

const el = document.querySelector('.app-root');

const renderer = () => ({ view }) =>
  ReactDom.render(
    typeof view == 'function' ? view() : view
    , el);

export default renderer;
