const gulp   = require('gulp');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const cache  = require('gulp-memory-cache');
const babel = require('gulp-babel');

gulp.task('jshint', function () {
    return gulp.src('src/**/app.js', {since: gulp.lastRun('jshint')})
        .pipe(jshint());
});

gulp.task('watch', function () {
    return gulp.watch('src/**/*.js', gulp.series('jshint'));
});

gulp.task('build', gulp.series('jshint', 'watch'));

gulp.task('buildjs', function () {
    return gulp.src('src/**/app.js', { since: cache.lastMtime('js') })
        .pipe(jshint())
        .pipe(cache('js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist'));
});

gulp.watch('src/**/*.js', gulp.series('buildjs'))
    .on('change', cache.update('js'));