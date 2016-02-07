const gulp = require('gulp');
const sync = require('browser-sync').create();

//serve the test site
gulp.task('serve', () => {
  sync.init({
    server:{
      baseDir: './test/example/_site'
    }
  });
  gulp.watch(['./test/example/_site/**/*'], sync.reload);
});
