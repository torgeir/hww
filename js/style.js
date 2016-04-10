
const style = {
  table: (p) => ({ ...p, display: 'table', height: '100%' }),
  tableCell: (p) => ({ ...p, display: 'table-cell', verticalAlign: 'middle' }),
  maxWidth: (p) => ({ ...p, maxWidth: '100%' }),
  backgroundColor: (backgroundColor, p) => ({ ...p, backgroundColor }),
  height: (height, p) => ({ ...p, height }),
  maxHeight: (p) => ({ ...p, maxHeight: '100%' }),
  block: (p) => ({ ...p, display: 'block' }),
  center: (p) => ({ ...p, margin: '0 auto' })
};

export default style;
