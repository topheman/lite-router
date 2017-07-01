const gulp = require('gulp');
const del = require('del');
const replace = require('gulp-replace-task');

gulp.task('clean', (cb) => {
  const files = [
    'build/dist/*',
    '!build/dist/.git*'
  ];
  console.log('Cleaning: ' + files);
  return del(files, cb);
});

gulp.task('copy:example', () => {
  return gulp.src('example/**')
    .pipe(gulp.dest('build/dist'));
});
gulp.task('copy:dist', () => {
  return gulp.src('dist/**')
    .pipe(gulp.dest('build/dist'));
});
gulp.task('copy', ['copy:example', 'copy:dist']);

gulp.task('replace-links', ['copy'], () => {
  gulp.src('build/dist/index.html')
    .pipe(replace({
      patterns: [
        {
          match: new RegExp('../dist/lite-router.js'),
          replacement: './lite-router.js'
        }
      ]
    }))
    .pipe(gulp.dest('build/dist'));
});


gulp.task('build:gh-pages', ['clean', 'replace-links']);
