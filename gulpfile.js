var gulp = require('gulp');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var scss = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');

var babel = require('gulp-babel');


var twig = require('gulp-twig');
var data = require('gulp-data');


var path = require('path');
var fs = require('fs');



var paths = {
    baseDestination: !!util.env.production ? 'build' : 'build-dev',
    baseSrc: 'src',
    js: {
        src: 'src/js',
        destination: 'js'
    },
    scss: {
        src: "src/scss",
        destination: 'css'
    },
    pages: {
        src: "src/pages"
    },
    mapJsons: {
        src: 'json',
        destination: 'json'
    }
    
}

var options = {

    baseDestination: path.join('./',paths.baseDestination),
    js: {
        files: path.join(paths.js.src, '**/*.js'),
        destination: path.join(paths.baseDestination, paths.js.destination),
    },
    scss: {
        file: path.join(paths.scss.src, 'styles.scss'),
        destination: path.join(paths.baseDestination, paths.scss.destination),
    },
    pages: {
        baseSrc: path.join(paths.pages.src),
        files: path.join(paths.pages.src, '**/index.twig'),
        destination: path.join(paths.baseDestination),
    },
    mapJsons: {
        files: path.join(paths.mapJsons.src, '**/*.json'),
        destination: path.join(paths.baseDestination, paths.mapJsons.destination),

    },
    browserSync: {
    
        server: {baseDir: [!!util.env.production ? 'build' : 'build-dev']},
        startPath: "/",
        port: 3000,
        online: false,
    
        open: true,
        logConnections: true,
    }
}
options.production = !!util.env.production;
if(options.production){
    console.log('-=PRODUCTION MODE=-');
    console.log('DESTINATION:',options.baseDestination);
}


gulp.task('js', function () {
  
    return gulp.src([
      options.js.files
    ])
    .pipe(babel({
        presets: ['@babel/env']
    }))
      .pipe(options.production ? uglify({}): util.noop())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(options.js.destination))

  });

gulp.task('css', function () {
    return gulp.src([
        options.scss.file
    ])
    .pipe(scss({
        errLogToConsole: true,
        includePaths: [ './node_modules/' ],
        outputStyle: 'expanded'
    }))
    .pipe(gulp.dest(options.scss.destination))
});
gulp.task('map-jsons', function () {
    return gulp.src([
        options.mapJsons.files
    ])
    .pipe(gulp.dest(options.mapJsons.destination))
});



var twigConfigs = {
    base:path.join(options.pages.baseSrc),
    namespaces: {
        'base': path.join(process.cwd(), options.pages.baseSrc),
        'layout': path.join(process.cwd(), options.pages.baseSrc , '/layout'),
        'includes': path.join(process.cwd(), options.pages.baseSrc , '/includes')
    },
    useFileContents: true,
    functions: [
        {
            name: 'activeMenu',
            func: function(target,current){
                if(target === current){
                    return 'active';
                }
                return '';
            }
        }
    ]
    
}

gulp.task('pages', function () {
    return gulp.src([options.pages.files])
    //Setting default data.
    .pipe(data(function(file){
        var currentMenu = path.basename(path.dirname(file.path));
            
        if(currentMenu === 'pages') {
            currentMenu = 'index' 
        };
        return {
            title:'Default Title',
            description:'Default Description',
            currentMenu: currentMenu
        }
    }))
    .pipe(data(function(file){

        let name = path.basename(path.dirname(file.path));
        let contentPath = file.path.replace('twig','yml');
        if(!fs.existsSync(contentPath)){
            return {};
        }
        let data = require('yaml-reader').read(contentPath);

        if(!data.titleSEO && !file.data.titleSEO){
            data.titleSEO = data.title;
        }
        if(!data.descriptionSEO && !file.data.descriptionSEO){
            data.descriptionSEO = data.description;
        }
        
        return  data;
   
    }))
    
    //Render via Twig plugin
    .pipe(twig(twigConfigs))

    .pipe(options.production ? htmlmin({ collapseWhitespace: true ,removeComments:true}) : util.noop())
    .pipe(gulp.dest(options.pages.destination));
});
var browserSync = browserSync.create();

gulp.task('browser-sync', function (cb) {
    browserSync.init(options.browserSync);
    cb();
});

gulp.task('browser-sync:reload', function (cb) {
    browserSync.reload();
    cb();
});


gulp.task('build',gulp.series('js','css','pages','map-jsons'));

gulp.task('watch:jsons', function () {
    return gulp.watch(path.join(paths.mapJsons.src,'**/*.json'),gulp.series('map-jsons','browser-sync:reload'));
});
gulp.task('watch:src', function () {
    return gulp.watch(path.join(paths.baseSrc,'**/**'),gulp.series('build','browser-sync:reload'));
});
gulp.task('watch', gulp.parallel('watch:jsons','watch:src'));

gulp.task('serve',gulp.series('build','browser-sync','watch','map-jsons'));
