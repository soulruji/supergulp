import gulp from "gulp";
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import gimage from 'gulp-image';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minifycss from 'gulp-csso';
import postcss from "gulp-postcss";
import browserslist from 'browserslist';
import bro from 'gulp-bro';
import babelify from 'babelify';


sass.compiler = require('node-sass');

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    sass: {
        watch: 'src/sass/**/*.scss',
        src: 'src/sass/style.scss',
        dest: 'build/css'
    },
    js: {
        watch: "src/js/**/.js",
        src: 'src/js/main.js',
        dest: 'build/js'
    }
};

const pug = () =>
    gulp
    .src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));

const img = () =>
    gulp
    .src(routes.img.src)
    .pipe(gimage())
    .pipe(gulp.dest(routes.img.dest));

const styles = () =>
    gulp
    .src(routes.sass.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(gulp.dest(routes.sass.dest));

const js = () =>
    gulp
    .src(routes.js.src)
    .pipe(bro({
        transform: [
            babelify.configure({ presets: ['@babel/preset-env'] }), ['uglifyify', { global: true }]
        ]
    }))
    .pipe(gulp.dest(routes.js.dest));



const clean = () => del(['build']);
const webserver = () =>
    gulp.src("build")
    .pipe(ws({ liveload: true, open: true }));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.sass.watch, styles);
    gulp.watch(routes.js.watch, js);
}

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
const postDev = gulp.series([webserver, watch]);
export const dev = gulp.series([prepare, assets, postDev]);