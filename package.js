Package.describe({
  name: 'lifelynl:intent',
  summary: 'Intention system for your application routing',
  version: "1.0.0",
  git: "https://github.com/lifelynl/meteor-intent"
});

Package.on_use(function (api) {
  // api.versionsFrom('METEOR@0.9.2');

  api.add_files([
    'lib/intent.js'
  ]);

  api.export('Intent');
});

Package.on_test(function (api) {
  api.use('lifelynl:intent');
  api.use('tinytest');

  // api.add_files('test/test.js');
  api.add_files('test/route_test.js');
});