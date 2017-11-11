/**
 * Created by jsherman on 11/9/17.
 * based on gulpfile from my_portfolio
 */

var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// these plugins do not seem to register with load-plugins
var concatCss = require('gulp-concat-css');
var htmlreplace = require('gulp-html-replace');



// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

// css tasks  ******************************************
gulp.task('lint:sass',	function()	{
    return	gulp.src('src/sass/*.scss')
        .pipe(plugins.sassLint({
            //	Pointing	to	config	file '.scss-lint.yml'
            configFile: '.sassLint.yml'
        }));
});


gulp.task('sass', function () {
    // custom is entry point for custom css and imports
    return gulp.src('src/scss/custom.scss')
    // pass custom title to gulp-plumber error handler function
        .pipe(customPlumber('Error Running	Sass'))
        //	Initialize	sourcemap
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(concatCss('styles.css'))
        // remove unused css
        .pipe(plugins.uncss({
            html: ['src/index.html']
        }))
        //	Runs	produced	CSS	through	autoprefixer
        .pipe(plugins.autoprefixer())
        // compress css
        .pipe(plugins.cssnano())
        //	Writing	sourcemaps
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/scss/custom.scss', ['sass']);
});

gulp.task('sass:vendor',	function()	{
    return	gulp.src('vendor/**/*.scss')
    // pass custom title to gulp-plumber error handler function
        .pipe(customPlumber('Error Running	Sass'))
        //	Initialize	sourcemap
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        //	Runs	produced	CSS	through	autoprefixer
        // .pipe(plugins.autoprefixer())
        //	Writing	sourcemaps
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('src/css'))
});

gulp.task('concatCss', function () {
    return gulp.src('src/css/*.css')
        .pipe(concatCss("css/styles.css"))
        .pipe(gulp.dest('dist'));
});

gulp.task('min-css', function() {
    return gulp.src('src/css/*.css', {base: 'src'})
        .pipe(concatCss("css/styles.min.css"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});


// js tasks


// html tasks
gulp.task('html:min', function() {
    return gulp.src('src/*.html')
        .pipe(htmlreplace({js: 'js/app.js', css: 'css/styles.css'}))
        // .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});


// Utility functions

function	customPlumber(errTitle)	{
    return	plugins.plumber({
        errorHandler:	plugins.notify.onError({
            //	Customizing	error	title
            title:	errTitle	||	"Error	running	Gulp",
            message:	"Error:	<%=	error.message	%>"
        })
    });
}

