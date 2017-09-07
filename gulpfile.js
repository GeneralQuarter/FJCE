var gulp = require('gulp');
var git = require('gulp-git');
var jeditor = require("gulp-json-editor");
var spawn = require('child_process').spawn;
var fs = require('fs');

// thanks to Mike 'Pomax' Kamermans: https://stackoverflow.com/questions/17516772/using-nodejss-spawn-causes-unknown-option-and-error-spawn-enoent-err/17537559#17537559
var npm = (process.platform === "win32" ? "npm.cmd" : "npm");
var firebase = (process.platform === "win32" ? "firebase.cmd" : "firebase");

gulp.task("merge-develop-into-master", function (done) {
  git.checkout('develop', function (err) {
    logError(err);
    git.pull('origin', 'develop', function (err) {
      logError(err);
      git.checkout('master', function (err) {
        logError(err);
        git.pull('origin', 'master', function (err) {
          logError(err);
          git.merge('develop', function (err) {
            logError(err);
            git.push('origin', function (err) {
              logError(err);
              done();
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
    process.stdout.write(data.toString());
  });

  c.stderr.on('data', function (data) {
    process.stderr.write(data.toString());
  });

  c.on('exit', function (code) {
    callback(code);
  });
}

gulp.task("build-prod", function (done) {
  exec(npm, ["run", "build", "--prod"], done);
});

gulp.task("firebase-deploy", function (done) {
  exec(firebase, ["deploy"], done);
});

gulp.task("push-tag", function (done) {
  git.push('origin', 'v' + getCurrentVersion(), function (err) {
    logError(err);
    done();
  });
});

gulp.task("copy-version", function () {
  return gulp.src("./src/assets/version.json")
    .pipe(jeditor({
      'version': getCurrentVersion()
    }))
    .pipe(gulp.dest("./src/assets/"));
});

gulp.task("post-bump", gulp.series(
  "copy-version",
  "build-prod"
));

gulp.task("post-tag", gulp.series(
  "push-tag",
  "firebase-deploy"
));

function getCurrentVersion() {
  return JSON.parse(fs.readFileSync('./package.json')).version;
}
