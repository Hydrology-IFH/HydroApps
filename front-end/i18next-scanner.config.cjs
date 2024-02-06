module.exports = {
    input: ['src/kombstra/**/*.{js,vue}'],
    options: {
        lngs: ['de'],
        defaultLng: 'en',
        resource: {
            loadPath: 'src/kombstra/locales/{{lng}}/{{ns}}.json',
            savePath: 'src/kombstra/locales/{{lng}}/{{ns}}.json',
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
        defaultNs: 'locale',
    }
}