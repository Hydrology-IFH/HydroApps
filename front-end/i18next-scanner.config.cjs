module.exports = {
    input: ['src/kombstra/**/*.{js,vue}'],
    options: {
        lngs: ['de', 'en'],
        defaultLng: 'en',
        resource: {
            loadPath: 'src/kombstra/locales/{{lng}}.json',
            savePath: 'src/kombstra/locales/{{lng}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        func: {
            list: ['i18next.t', 'i18n.t', 'this.$t', '$t'],
            extensions: ['.js', '.vue']
        },
        debug: false,
        pluralSeparator: 'xacy_never-happens-ß?876',
        nsSeparator: false, // namespace separator
        keySeparator: false, // key separator
        removeUnusedKeys: true,
    }
}