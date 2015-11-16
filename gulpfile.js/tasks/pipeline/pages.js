'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const path = require('path')
const util = require('util')

// npm
const gulp = require('gulp')
const jade = require('jade')
const md = require('gulp-markdown')
const fm = require('gulp-front-matter')
const through = require('through2')
const merge = require('lodash.merge')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
let forest = {}

// plant a tree
function plant() {
  return through.obj((file, _, cb) => {
    // grab content string
    const content = file.contents.toString()

    // file names
    const longName = file.path
    const name = path.basename(longName)
    const shortName = path.basename(name, path.extname(name))

    // build tree
    const tree = {}
    const heading = file.relative
      .replace(name, '')
      .replace(path.sep, '')
    if (heading.length) {
      tree[heading] = {}
      tree[heading][shortName] = content
    } else {
      tree[shortName] = content
    }

    // merge tree into forest
    merge(forest, tree)
    // merge(this, tree)
    cb()
  })
}

// grow a forest
function grow() {
  return gulp.src('source/markup/blocks/**/*.md')
    .pipe(fm())
    .pipe(md())
    .pipe(plant())
}

// log the forest
function log(cb) {
  console.log(forest)
  cb()
}

gulp.task(grow)
gulp.task('default', gulp.series(grow, log))
