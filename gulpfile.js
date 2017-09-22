const gulp = require('gulp')
const replace = require('gulp-replace')

gulp.task('copySrc', () => {
  gulp
    .src('src/**/*')
    .pipe(gulp.dest('dist/src'))
})

gulp.task('changeEnv', () =>{
  gulp.src(['./.env'])
    .pipe(replace('development', 'production'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('copyOthers', () => {
  gulp
    .src(['*','!dist', '!node_modules'])
    .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['copySrc', 'copyOthers', 'changeEnv'])