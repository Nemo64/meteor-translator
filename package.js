Package.describe({
  summary: "A feature rich translation package"
});

Package._transitional_registerBuildPlugin({
  name: 'compileLanguage',
  use: ['underscore', 'ejson'],
  sources: [
    'src/Locale.js',
    'src/LanguageArray.js',
    'src/plugin/compile-language.js'
  ],
  npmDependencies: { 'js-yaml': '3.0.2' }
});

Package.on_use(function(api) {
  api.use([
    'underscore',
    'ejson',
    'deps',
    // meteorite
    'inject-initial'
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
    'src/filter/parameter.js',
    'src/filter/condition.js',
    'src/Translator/globalLang.js',
    'src/Translator/defaultLanguage.js'
  ]);
  api.add_files([
    'src/Namespace-client.js',
    'src/helper/createHelper-client.js'
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
  api.use(['translator', 'tinytest', 'test-helpers']);
  api.add_files([
    'test/namespace.de_DE.lang.yml',
    'test/namespace.en_US.lang.yml'
  ]);
  api.add_files([
    'src/Locale-test.js',
    'src/LanguageArray-test.js',
    'src/Namespace-test.js',
    'src/FilterList-test.js',
    'src/filter/parameter-test.js',
    'src/filter/condition-test.js',
    'src/Translator-test.js'
  ]);
  api.add_files([
    'src/inject/accept-language-test.js'
  ], 'server');
});
