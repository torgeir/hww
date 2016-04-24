import React from "react";

export default class Icon extends React.Component {
  render() {
    const props = this.props;
    const color = props.color;
    const styles = color ? {fill: color} : null;
    const svg = require(`../../node_modules/open-iconic/svg/${props.name}.svg`);
    const strippedSvg = svg.replace(/<svg.*?>/, "").replace(/<\/svg>/, "");

    return (
      <svg
          style={styles}
          xmlns="http://www.w3.org/2000/svg"
          width={ props.size || 16 }
          height={ props.size || 16 }
          {...props}
          viewBox="0 0 8 8"
          dangerouslySetInnerHTML={{__html: strippedSvg}}>
      </svg>
    );
  }
}
