'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const gulp = require('gulp')
const jade = require('jade')
const md = require('gulp-markdown')
const fm = require('gulp-front-matter')
const through = require('through2')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
function logger() {
  return through.obj((file, _, cb) => {
    function formatter(key, val) {
      if (key === '_contents') {
        return file.contents.toString()
      }
      if (key === 'stat') return
      return val
    }
    console.log(JSON.stringify(file, formatter, 2))
    return cb(null, file)
  })
}

function blocks() {
  return gulp.src('source/markup/blocks/**/*.md')
    .pipe(fm())
    .pipe(md())
    .pipe(logger())
    .pipe(gulp.dest('dist'))
}

function tree() {
  let treeObj = {}
  gulp.src('source/markup/blocks/**/*.md')
}

gulp.task(blocks)
gulp.task('default', blocks)
