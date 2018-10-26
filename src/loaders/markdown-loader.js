const marked = require('marked');

module.exports = function exports(source, map) {
  const sourceJSON = JSON.stringify(source, null, 2);
  const mapJSON = JSON.stringify(map, null, 2);
  const markedJSON = marked(source);
  // console.log('\n\n\nthis', this, '\n\n\n');
  // console.log('\n\n\nsourceJSON', sourceJSON, '\n\n\n');
  // console.log('\n\n\nmapJSON', mapJSON, '\n\n\n');

  const transformedValue = `
export default function (Component) {
  // console.log('==========================');
  Component.options.__docs = \`${markedJSON}\`;
  // console.log('\\n\\n\\n...Component.options.__docs', Component.options.__docs, '\\n\\n\\n');
  // console.log('\\n\\n\\n...Component', Component, '\\n\\n\\n');
  // console.log('\\n\\n\\n...sourceJSON', \`${sourceJSON}\`, '\\n\\n\\n');
  // console.log('\\n\\n\\n...mapJSON', \`${mapJSON}\`, '\\n\\n\\n');
  // console.log('==========================');
}
`;

  this.callback(
    null,
    transformedValue,
    map
  );
};
