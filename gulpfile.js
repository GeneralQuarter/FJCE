var gulp = require('gulp');
var git = require('gulp-git');
var argv = require('yargs').argv;
var edit = require('gulp-edit');
var spawn = require('child_process').spawn;

// thanks to Mike 'Pomax' Kamermans: https://stackoverflow.com/questions/17516772/using-nodejss-spawn-causes-unknown-option-and-error-spawn-enoent-err/17537559#17537559
var npm = (process.platform === "win32" ? "npm.cmd" : "npm");
var firebase = (process.platform === "win32" ? "firebase.cmd" : "firebase");

var currentVersion = "";

gulp.task("checkoutPullDevelop", function (done) {
  git.checkout('develop', function (err) {
    logError(err);
    git.pull('origin', 'develop', function (err) {
      logError(err);
      done();
    });
  });
});

gulp.task("commitVersionNumber", function () {
  return gulp.src("./src/assets/version.txt")
    .pipe(git.add())
    .pipe(git.commit('Bumped the version number to ' + currentVersion));
});

gulp.task("pushDevelopTagUpdateMaster", function (done) {
  git.push('origin', 'develop', function (err) {
    logError(err);
    git.checkout('master', function (err) {
      logError(err);
      git.pull('origin', 'master', function (err) {
        logError(err);
        git.merge('develop', function (err) {
          logError(err);
          git.push('origin', function (err) {
            logError(err);
            git.tag('v' + currentVersion, 'Release ' + currentVersion, function (err) {
              logError(err);
              git.push('origin', 'v' + currentVersion, function (err) {
                logError(err);
                done();
              });
            });
          });
        });
      });
    });
  });
});

function logError(err) {
  if (err) throw err;
}

function exec(command, options, callback) {
  var c = spawn(command, options);

  c.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  c.stderr.on('data', function (data) {
    console.error(data.toString());
  });

  c.on('exit', function (code) {
    callback(code);
  });
}

gulp.task("buildRelease", function (done) {
  exec(npm, ["run", "build", "--prod"], done);
});

gulp.task("deployRelease", function (done) {
  exec(firebase, ["deploy"], done);
});

gulp.task("version", function () {
  return gulp.src('./src/assets/version.txt')
    .pipe(edit(function (src, cb) {
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

gulp.task("release", gulp.series(
  "checkoutPullDevelop",
  "version",
  "buildRelease",
  "commitVersionNumber",
  "pushDevelopTagUpdateMaster",
  "deployRelease"
));
