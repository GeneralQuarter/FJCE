var gulp  = require('gulp');
var git   = require('gulp-git');
var argv  = require('yargs').argv;
var edit = require('gulp-edit');

var currentVersion = "";

gulp.task("deploy", function () {
  return gulp.start("version", function () {
    console.log(currentVersion);
  });
});

gulp.task("version", function () {
  return gulp.src('./src/assets/version.txt')
    .pipe(edit(function(src, cb){
      var bump = 2; // PATCH
      switch (argv.bump) {
        case "MAJOR":
          bump = 0;
          break;
        case "MINOR":
          bump = 1;
          break;
      }
      src = src.replace('\n', '');
      var numberArray = src.split(".");
      for (var i = 0; i < numberArray.length; i++) {
        var number = parseInt(numberArray[i]);
        if (i === bump) {
          number++;
        } else if (number > bump) {
          number = 0;
        }
        numberArray[i] = number;
      }
      currentVersion = numberArray.join('.');
      src = currentVersion + '\n';
      cb(null, src);
    }))
    .pipe(gulp.dest('./src/assets/'))
});
