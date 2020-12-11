let gulp = require('gulp');
let mathjax = require('gulp-mathjax-page');
let cleanCSS = require('gulp-clean-css');
let htmlmin = require('gulp-htmlmin');
let htmlclean = require('gulp-htmlclean');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');

// gulp.task('minify-mathjax',  done => {
//     return gulp.src('./public/**/*.html')
// 	    .pipe(mathjax({
// 	        mjpageConfig: {
// 	            format: ['TeX'],
// 	            singleDollars: true,
// 	            cssInline: false,
// 	            mhchem: {legacy: true}
// 	        },
// 	        mjnodeConfig: {
// 	            svg: true,
// 	            css: false,
// 	            speakText: false
// 	        }
// 	    }))
// 	    .pipe(gulp.dest('./public'))
// 	    done();
// });

gulp.task('minify-css', done => {
	return gulp.src('./public/**/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('./public'));
		done();
});

gulp.task('minify-html', done => {
	return gulp.src('./public/**/*.html')
	    .pipe(htmlclean())
	    .pipe(htmlmin({
	         removeComments: true,
	         minifyJS: true,
	         minifyCSS: true,
	         minifyURLs: true
	    }))
	    .pipe(gulp.dest('./public'))
	    done();
});

gulp.task('minify-js', done => {
    return gulp.src('./public/js/*.js')
    	.pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
        done();
});


// gulp.task('default',gulp.series(gulp.parallel('minify-html','minify-css','minify-js','minify-mathjax')));
gulp.task('default',gulp.series(gulp.parallel('minify-html','minify-css','minify-js')));
