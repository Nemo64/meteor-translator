Package.describe({
  summary: "A feature rich translation package"
});

Package._transitional_registerBuildPlugin({
  name: 'compileLanguage',
  use: ['underscore', 'ejson'],
  sources: [
    'lib/Locale.js',
    'lib/LanguageArray.js',
    'plugin/compile-language.js'
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
    'lib/Locale.js',
    'lib/LanguageArray.js',
    'lib/NamespaceAbstract.js',
    'lib/FilterList.js',
    'lib/Translator.js',
    'lib/FilterList/parameter.js',
    'lib/Translator/globalLang.js'
  ]);
  api.add_files([
    'client/Namespace.js',
    'client/helper.js'
  ], 'client');
  api.add_files([
    'server/Namespace.js',
    'server/inject/namespaces.js',
    'server/inject/language.js'
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
    'lib/Locale-test.js',
    'lib/LanguageArray-test.js',
    'lib/Namespace-test.js',
    'lib/FilterList-test.js',
    'lib/FilterList/parameter-test.js',
    'lib/Translator-test.js'
  ]);
});
