module.exports = {
    output: 'src/kombstra',
    input: ['src/kombstra/**/*.{js,vue}'],
    options: {
        lngs: ['de'],
        defaultLng: 'en',
        resource: {
            loadPath: 'locales/{{lng}}/{{ns}}.json',
            savePath: 'locales/{{lng}}/{{ns}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        func: {
            list: ['i18next.t', 'i18n.t', 'this.$t', '$t'],
            extensions: ['.js', '.vue']
        },
        interpolation: {
            prefix: '{{',
            suffix: '}}',
        },
        trans: {
            component: 'Trans',
            extensions: [],
        },
        debug: true,
        pluralSeparator: 'xacy_never-happens-ß?876',
        nsSeparator: false, // namespace separator
        keySeparator: false, // key separator
        defaultNs: 'locale',
    }
}