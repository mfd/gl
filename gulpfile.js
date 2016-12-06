var gulp = require('gulp'), 
    fs = require('fs');
    path =  require('path'),
    watch = require('gulp-watch'),

    gutil = require('gulp-util'),
    data = require('gulp-data'),

    //FS
    concat = require('gulp-concat'), // объединяет файлы в один бандл
    uglify = require('gulp-uglify'),
    notify = require("gulp-notify") ,
    fileinclude = require('gulp-file-include'), // замена 
    rimraf = require('rimraf'), //замена rimraf
    
    //HTML
    jade = require('gulp-jade'),

    //CSS
    compass = require('gulp-compass'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    sourcemaps = require('gulp-sourcemaps'),
    //minifyCSS = require('gulp-minify-css'), //-> gulp-clean-css
    cleanCSS = require('gulp-clean-css'),

    //webserver
    browserSync = require("browser-sync"),
        reload = browserSync.reload;
    ngrok = require('ngrok'); //замена localtunnel, inspector => http://127.0.0.1:4040 

    // npm i gutil gulp-concat gulp-uglify gulp-notify gulp-file-include rimraf gulp-jade gulp-compass gulp-sourcemaps gulp-clean-css browser-sync ngrok --save-dev
    // npm i gulp-notify --save-dev
    // npm i gulp-data --save-dev


var config = {
    server: {
        baseDir: "./build",
        directory: true // or index: "index.html"
    },
    //tunnel: true,
    host: 'localhost',
    port: 1985,
    directoryListing: true,
    logPrefix: ''
};

var path = {
        build: {
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            data: 'build/data/',
            img: 'build/imgs/',
            fonts: 'build/fonts/',
            dt: 'build/data/'
        },
        src: {
            html: 'assets/jade/src/**/*.jade',
            js: ['assets/js/*.js'],
            style: 'assets/css/alls.scss',
            less: 'assets/less/**/*.less',
            img: 'assets/imgs/**/*.*',
            fonts: 'assets/fonts/**/*.*',
            dt: 'assets/data/**/*.*',
            data_app: './assets/app.json'
        },
        watch: {
            html: 'assets/jade/**/*.jade',
            js: 'assets/js/**/*.js',
            style: 'assets/css/**/*.*',
            img: 'assets/img/**/*.*',
            fonts: 'assets/css/fonts/**/*.*',
            dt: 'assets/data/**/*.*'
        },
        revision: new Date().getTime(),
        bowerDir: './bower_components',
            production: !!gutil.env.production,
        clean: './build'
    };



gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});



gulp.task('webserver', function () {
  //browserSync(config);
  browserSync(config, function (err, bs) {
    ngrok.connect({
      proto: 'http', // http|tcp|tls 
      addr: bs.options.get('port'), // port or network address 
      //auth: 'user:pwd', // http basic authentication for tunnel 
      //subdomain: 'psell', // reserved tunnel name https://alex.ngrok.io 
      //authtoken: '5CnyBoBGqGPzRbXmqzBWb_5c7athHzpG24uUKANTuFW', // your authtoken from ngrok.com 
      //region: 'us' // one of ngrok regions (us, eu, au, ap), defaults to us 
    }, function (err, url) { 
      gutil.log('[ngrok]', ' => ', gutil.colors.magenta(url));
      gutil.log('[ngrok]', ' => ', 'http://'+config.host+':'+config.port);
    });         
  });         
});



//HTML TASK
gulp.task('html:build', function() {
    var jsonData = JSON.parse(fs.readFileSync('./assets/app.json'));

    gulp.src([
        path.src.html
    ])
    .pipe(data(function(file) { return jsonData }))
    .pipe(data(function(file) {
      return {
        pageName: file.history[0].replace(file.base, '').split('.')[0]
        //relativePath: file.history[0].replace(file.base, '')
      };
    }))
    .pipe(jade({
        filename: 'base',
        basedir: __dirname + '/',
        pretty: true
        }))
    .on('error', function (err) { console.log(err); })
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});


//CSS TASK
//https://github.com/Compass/compass/issues/2052#issuecomment-200599690

gulp.task('compass', function() {
    gulp.src('./assets/css/all.scss')
        .pipe(compass({
            config_file: './compass/config.rb',
            sourcemap:true,
            //comments: true,
            logging: true,
            style: 'compressed',
            sass: 'assets/css',
            css: './build/css',
        }))
        .on('error', function(err) {
            console.log(err);
        })
        //.pipe(minifyCSS())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('sass:build', function () {
    gulp.src('./assets/css/**/*.scss') //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});


gulp.task('style:build', [
    //'less:build',
    'compass'
    //'sass:build',
]);


//JS TASK
gulp.task('js:build', function () {
    //gulp.src(path.src.js) 
    gulp.src(['assets/js/vendors.js', 'assets/js/mocha.js'])
    //.pipe(rigger()) 
    .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
    //.pipe(sourcemaps.init()) 
    .pipe(uglify()) 
    //.pipe(sourcemaps.write()) 
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('img:build', function () {
    gulp.src(path.src.img) 
    // .pipe(imagemin({
    //     progressive: true,
    //     svgoPlugins: [{removeViewBox: false}],
    //     use: [pngquant()],
    //     interlaced: true
    // }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
})




gulp.task('fonts:build', function() {
   gulp.src(path.src.fonts)
   .pipe(gulp.dest(path.build.fonts))
});




// BUILD
gulp.task('build', [
    'img:build',
    'style:build',
    'html:build',
    'js:build',
    'fonts:build'
    //'data:build',

]);


gulp.task('watch', function(){
    watch([path.watch.html,'./assets/jade/all.json'], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.dt], function(event, cb) {
        gulp.start('data:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });

});


gulp.task('default', ['build', 'webserver', 'watch']);