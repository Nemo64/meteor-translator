Package.describe({
  name: "nemo64:translator",
  summary: "A feature rich internationalization (i18n) solution.",
  version: "0.6.15",
  git: "https://github.com/Nemo64/meteor-translator"
});

Package._transitional_registerBuildPlugin({
  name: 'language-compiler',
  use: [
    'underscore',
    'ejson', // LanguageArray and Locale have it, not really required
    'nemo64:cldr@2.3.0'
  ],
  sources: [
    'src/Locale.js',
    'src/LanguageArray.js',
    'src/FilterList.js',
    'src/plugin/resource-handler.js',
    'src/plugin/message-format.js',
    'src/message-format/select-preprocess.js',
    'src/message-format/plural-preprocess.js',
    'src/message-format/datetime-preprocess.js',
    'src/message-format/number-preprocess.js'
  ],
  npmDependencies: {
    'js-yaml': '3.2.1'
  }
});

Package.on_use(function(api) {
  api.versionsFrom("METEOR@0.9.1");
  api.use([
    'underscore',
    'ejson', // LanguageArray and Locale are ejson'able
    'deps',
    // meteorite
    'meteorhacks:inject-initial@1.0.2',
    'mrt:moment@2.8.1'
  ]);
  api.use([
    'http'
  ], 'client');

  api.add_files([
    'src/Locale.js',
    'src/LanguageArray.js',
    'src/Namespace.js',
    'src/FilterList.js',
    'src/Translator.js',
    'src/filter/message-format.js',
    'src/message-format/select-postprocess.js',
    'src/message-format/plural-postprocess.js',
    'src/message-format/datetime-postprocess.js',
    'src/message-format/number-postprocess.js',
    'src/Translator/globalLang.js',
    'src/Translator/defaultLanguage.js'
  ]);
  api.add_files([
    'src/Namespace-client.js'
  ], 'client');
  api.add_files([
    'src/Namespace-server.js',
    'src/inject/namespaces-server.js',
    'src/inject/accept-language-server.js'
  ], 'server');
  
  api.add_files(['Translator.js']);
  api.export(['Translator']);
});

Package.on_test(function (api) {
  api.use(['nemo64:translator', 'mrt:moment@2.8.1', 'underscore', 'tinytest', 'test-helpers']);
  api.add_files([
    'test/namespace.de_DE.lang.yml',
    'test/namespace.en_US.lang.yml'
  ]);
  api.add_files([
    'src/Locale-test.js',
    'src/LanguageArray-test.js',
    'src/Namespace-test.js',
    'src/FilterList-test.js',
    'src/message-format/select-test.js',
    'src/message-format/plural-test.js',
    'src/message-format/datetime-test.js',
    'src/message-format/number-test.js',
    'src/Translator-test.js'
  ]);
  api.add_files([
    'src/inject/accept-language-test.js'
  ], 'server');
});
