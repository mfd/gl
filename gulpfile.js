var gulp = require('gulp'),
    watch = require('gulp-watch'),
    pkg = require('./package.json'),
    plugins = {};
    // gulp-clean-css -> plugins.clean_css
    Object.keys(require('./package.json')['devDependencies'])
        .filter(function (pkg) { return pkg.indexOf('gulp-') === 0; })
        .forEach(function (pkg) {
            plugins[pkg.replace('gulp-', '').replace(/-/g, '_')] = require(pkg);
        });

var gutil = require('gulp-util');
var fs = require('fs');
var rimraf = require('rimraf');
var path =  require('path');
    //webserver
var browserSync = require("browser-sync"),
        reload = browserSync.reload;
var ngrok = require('ngrok'); //замена localtunnel, inspector => http://127.0.0.1:4040 


var config = {
    server: {
        baseDir: "./build",
        directory: true // or index: "index.html"
    },
    //tunnel: true,
    host: 'localhost',
    port: 1985,
    directoryListing: true,
    logPrefix: '',
    production: !!gutil.env.production
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
        clean: './build'
    };

var comment = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    //' * <%= pkg.homepage %>\n' +
    ' * <%= pkg.author %> // '+ new Date(Date.now()).toLocaleString() +'\n' +
    ' * Released under the <%= pkg.license %> license.\n' +
    '*/\n\n';

function log(error) {
    gutil.log([
        '',
        gutil.colors.white.bgRed("    ERROR MESSAGE START    ") 
        + gutil.colors.red("  [" + error.name + " in " + error.plugin + "]"),
        error.message,
        gutil.colors.white.bgRed("    ERROR MESSAGE END    "),
        ''
    ].join('\n'));
    this.end();
}

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
      gutil.log(err.msg);
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
    .pipe(plugins.data(function(file) { return jsonData }))
    .pipe(plugins.data(function(file) {
      return {
        pageName: file.history[0].replace(file.base, '').split('.')[0]
        //relativePath: file.history[0].replace(file.base, '')
      };
    }))
    .pipe(plugins.jade({
        filename: 'base',
        basedir: __dirname + '/',
        pretty: !config.production ? true : false
        }))
    .on('error', log)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});


//CSS TASK
//https://github.com/Compass/compass/issues/2052#issuecomment-200599690

gulp.task('compass', function() {
    gulp.src('./assets/css/all.scss')
      .pipe(plugins.compass({
          config_file: './compass/config.rb',
          sourcemap:true,
          //comments: true,
          logging: true,
          style: 'compressed',
          sass: 'assets/css',
          css: './build/css',
      }))
      .on('error', log)        
      //.pipe(minifyCSS())
      .pipe(gulp.dest('./build/css/'));
});

gulp.task('sass:build', function () {
  if (!config.production){
    gulp.src('./assets/css/**/*.scss') //Выберем наш main.scss
      .pipe(plugins.sourcemaps.init()) 
      .pipe(plugins.sass({
          errLogToConsole: true,
          sourceComments: 'map',
          sourceMap: 'sass',
          outputStyle: 'nested', //expanded
          precision: 3
      }).on('error', log)) //Скомпилируем
      .pipe(plugins.autoprefixer()) //Добавим вендорные префиксы
      //.pipe(plugins.cssmin()) //Сожмем
      .pipe(plugins.sourcemaps.write('maps/', {
          includeContent: true
          }))
      .pipe(gulp.dest(path.build.css)) //И в build
      .pipe(reload({stream: true}));
  } else {
    gulp.src('./assets/css/**/*.scss') //Выберем наш main.scss
      .pipe(plugins.sass().on('error', log)) //Скомпилируем
      .pipe(plugins.autoprefixer()) //Добавим вендорные префиксы
      .pipe(plugins.cssmin()) //Сожмем
      .pipe(gulp.dest(path.build.css)) //И в build
      .pipe(reload({stream: true}));    
  }

});


gulp.task('style:build', [
    //'less:build',
    //'compass'
    'sass:build',
]);


//JS TASK
gulp.task('js:build', function () {
  if (!config.production){
    //gulp.src(path.src.js) 
    gulp.src(['assets/js/vendors.js', 'assets/js/mocha.js'])
    //.pipe(rigger()) 
    .pipe(plugins.sourcemaps.init()) 
    .pipe(plugins.file_include({
            prefix: '@@',
            basepath: '@file'
        }))
    .pipe(plugins.sourcemaps.write()) 
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
  } else {
    //gulp.src(path.src.js) 
    gulp.src(['assets/js/vendors.js', 'assets/js/mocha.js'])
    .pipe(plugins.file_include({
            prefix: '@@',
            basepath: '@file'
        }))
    .pipe(plugins.uglify())
    .pipe(plugins.banner(comment, {pkg: pkg}))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));


  }
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

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(plugins.gh_pages());
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