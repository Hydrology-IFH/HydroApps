const fs = require('fs');
const path = require('path');

module.exports = {
  input: ['src/**/**/*.{js,vue}'],
  options: {
    lngs: ['de', 'en'],
    defaultLng: 'en',
    resource: {
      loadPath: 'src/{{ns}}/locales/{{lng}}.json',
      savePath: 'src/{{ns}}/locales/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    func: { list: [], extensions: [] },
    debug: false,
    pluralSeparator: 'xacy_never-happens-ß?876',
    ns: ['kombstra', 'sri_bw', 'sfi_mockup', 'common'],
    defaultNs: "kombstra",
    nsSeparator: ".", // not used as defined manualy in transform
    keySeparator: false, // key separator
    removeUnusedKeys: true,
    sort: true,
    trans: false
  },
  transform: function customTransform(file, enc, done) {
    "use strict";
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    const nsfile = path.relative(__dirname, file.path).split(path.sep)[1];

    parser.parseFuncFromString(
      content,
      { list: ['i18next.t', 'i18n.t', 'this.$t', '$t'] },
      (key, options) => {
        let key_groups = key.split(".");
        let ns = key_groups.length > 1 ? key_groups[0] : nsfile;
        parser.set(
          key,
          Object.assign({}, options, { ns: ns }));
      }
    );

    done();
  }
}