import style from '../lib/style';

const Image = (props) => {

  const s =
   Object.assign({},
     style.block(
     style.center(
     style.maxWidth(
     style.maxHeight()))),
     props.style);
  return <img src={ props.src } style={ s } />;
};

export default Image;
