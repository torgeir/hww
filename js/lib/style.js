const style = {
  table: (p) => ({ ...p, display: 'table', height: '100%' }),
  tableCell: (p) => ({ ...p, display: 'table-cell', verticalAlign: 'middle' }),
  backgroundColor: (backgroundColor) => (p) => ({ ...p, backgroundColor }),
  height: (height) => (p) => ({ ...p, height }),
  maxWidth: (p) => ({ ...p, maxWidth: '100%' }),
  maxHeight: (p) => ({ ...p, maxHeight: '100%' }),
  block: (p) => ({ ...p, display: 'block' }),
  center: (p) => ({ ...p, margin: '0 auto' })
};

const comp = (f, g) => (...args) => f(g(...args));

export const compose = (...fns) =>
  fns.reduce(comp, (a) => a);

export default style;
