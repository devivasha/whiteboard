const gulp = require('gulp');
const sass = require('gulp-sass');

const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('01/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('01/build/css'));

});


gulp.task('style:vendor', function () {
    return gulp
        .src([
            './node_modules/bootstrap/dist/css/bootstrap.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('01/build/css'));
});

gulp.task('script', function(){
    return gulp.src([
        './01/scripts/components/**/*.js',
        './01/scripts/main.js'
    ])
        // .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('01/build/js'));
});

gulp.task('script:vendor', function () {
    return gulp
        .src([
                './node_modules/axios/dist/axios.js',
                './node_modules/jquery/dist/jquery.js',
                './node_modules/bootstrap/dist/js/bootstrap.js',
                './node_modules/@fortawesome/fontawesome-free/js/all.js'
            ]
        )
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('01/build/js'));
});


gulp.task('watch:sass', function () {
    gulp.watch('01/scss/**/*.scss', gulp.series('sass'));
});

gulp.task('watch:script', function () {
    gulp.watch('01/scripts/**/*.js', gulp.series('script'));
});

gulp.task('watch', gulp.parallel('watch:script', 'style:vendor', 'watch:sass'));

gulp.task('default', gulp.series('style:vendor', 'script:vendor','sass', 'script')
);