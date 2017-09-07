var gulp = require('gulp');
var git = require('gulp-git');
var spawn = require('child_process').spawn;
var fs = require('fs');
var bump = require('gulp-bump');
var conventionalChangelog = require('gulp-conventional-changelog');

// thanks to Mike 'Pomax' Kamermans: https://stackoverflow.com/questions/17516772/using-nodejss-spawn-causes-unknown-option-and-error-spawn-enoent-err/17537559#17537559
var npm = (process.platform === 'win32' ? 'npm.cmd' : 'npm');
var firebase = (process.platform === 'win32' ? 'firebase.cmd' : 'firebase');

gulp.task('merge-develop-into-master', function (done) {
  git.checkout('develop', function (err) {
    logError(done, err);
    git.pull('origin', 'develop', function (err) {
      logError(done, err);
      git.checkout('master', function (err) {
        logError(done, err);
        git.pull('origin', 'master', function (err) {
          logError(done, err);
          git.merge('develop', function (err) {
            logError(done, err);
            done();
          });
        });
      });
    });
  });
});

function logError(cb, err) {
  if (err) {
    return cb(err);
  }
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

gulp.task('build-prod', function (done) {
  exec(npm, ['run', 'build', '--prod'], done);
});

gulp.task('firebase-deploy', function (done) {
  exec(firebase, ['deploy'], done);
});

gulp.task('push-to-master', function (done) {
  git.push('origin', function (err) {
    logError(done, err);
    done();
  });
});

gulp.task('bump-version', function () {
  return gulp.src(['./package.json', './src/assets/version.json'])
    .pipe(bump({type: 'patch'}).on('error', function (error) {
      throw error;
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add('.'))
    .pipe(git.commit('chore(release): Bumped version number to ' + getCurrentVersion()));
});

gulp.task('create-new-tag', function (done) {
  var version = 'v' + getCurrentVersion();
  git.tag(version, 'Release ' + version, function (error) {
    logError(done, error);
    git.push('origin', version, done);
  });
});

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular' // Or to any other commit message convention you use.
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('release', gulp.series(
  'merge-develop-into-master',
  'bump-version',
  'build-prod',
  'changelog',
  'commit-changes',
  'create-new-tag',
  'push-to-master',
  'firebase-deploy'
));

function getCurrentVersion() {
  return JSON.parse(fs.readFileSync('./package.json')).version;
}
