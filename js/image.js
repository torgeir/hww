import style from './style';

const Image = ({ src }) => {

  const s =
    style.block(
    style.center(
    style.maxWidth(
    style.maxHeight())));

  return <img src={ src } style={ s } />;
};

export default Image;
