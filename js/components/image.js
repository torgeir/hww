import style, { compose } from '../lib/style';

const Image = (props) => {

  const s = compose(
     style.block,
     style.center,
     style.maxWidth,
     style.maxHeight)(props.style);
  return <img src={ props.src } style={ s } />;
};

export default Image;
