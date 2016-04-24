var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    coveralls = require('gulp-coveralls'),
    plumber = require('gulp-plumber');
    
//Tests task
gulp.task('tests', function (cb) {
    var mochaErr;

    gulp.src('test/*.js')
        .pipe(plumber())
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', function (err) {
            mochaErr = err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
});

//Watch task
gulp.task('watch', function () {
    gulp.watch('bin/cli.js', ['tests']);
    gulp.watch('app/testClient.js', ['tests']);
});

gulp.task('default', ['tests', 'watch']);