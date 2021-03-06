Package.describe({
  name: 'lifelynl:intent',
  summary: 'Intention system for your application routing',
  version: "1.0.1",
  git: "https://github.com/lifelynl/meteor-intent"
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.1.0.2');

  api.use([
    'iron:router@1.0.9'
  ], 'client');

  api.add_files([
    'lib/intent.js'
  ], 'client');

  api.export('Intent');
});

Package.on_test(function (api) {
  api.use('lifelynl:intent');
  api.use('tinytest');

  // api.add_files('test/test.js');
});
