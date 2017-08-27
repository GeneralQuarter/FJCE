var gulp  = require('gulp');
var git   = require('gulp-git');
var argv  = require('yargs').argv;
var edit  = require('gulp-edit');
var shell = require('gulp-shell');

var currentVersion = "";

gulp.task("release", function (done) {
  git.checkout('develop', function (err) {
    logError(err);
    git.pull('origin', 'develop', function (err) {
      logError(err);
      gulp.start("version", function () {
        gulp.src("./*")
          .pipe(git.add())
          .pipe(git.commit('Bumped the version number to ' + currentVersion))
      });
    });
  });

  stream.on('end', function() {
    git.push('origin', 'develop', function (err) {
      logError(err);
      git.checkout('master', function (err) {
        logError(err);
        git.pull('origin', 'master', function (err) {
          logError(err);
          git.merge('develop', function (err) {
            logError(err);
            git.tag('v' + currentVersion, 'Release ' + currentVersion, function (err) {
              logError(err);
              git.push('origin', function (err) {
                logError(err);
                gulp.start("build", function () {
                  gulp.start("deploy", function () {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  stream.on('error', function(err) {
    done(err);
  });
});

function logError(err) {
  if (err) throw err;
}

gulp.task("build", shell.task('ionic build --prod'));

gulp.task("deploy", shell.task('firebase serve'));

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
