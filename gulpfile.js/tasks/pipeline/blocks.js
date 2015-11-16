'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const path = require('path')
const util = require('util')

// npm
const gulp = require('gulp')
const jade = require('gulp-jade')
const md = require('gulp-markdown')
const fm = require('gulp-front-matter')
const through = require('through2')
const merge = require('lodash.merge')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
let forest = {}
let html = ''

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
    cb()
  })
}

// grow the forest
function grow() {
  return gulp.src('source/markup/blocks/**/*.md')
    .pipe(fm())
    .pipe(md())
    .pipe(plant())
}

function appendToHtml(cb) {
  return through.obj((file, _, cb) => {
    html += file.contents.toString()
    console.log('test1')
    return cb()
  })
}

// apply jade template
function applyTemplate(val, key) {
  return gulp.src('source/markup/templates/block.jade')
    .pipe(jade({locals: {
      header: key
    }}))
    .pipe(appendToHtml())
}

// recursively applyTemplate
function applyTemplates(obj) {
  Object.keys(obj).map(key => {
    const val = obj[key]
    return typeof val === 'object'
      ? applyTemplates(val)
      : applyTemplate(val, key)
  })
}

function templates(cb) {
  // applyTemplates(forest)
  // cb()
  return cb(applyTemplates(forest))
}

// log the forest
function logF(cb) {
  console.log(forest)
  cb()
}

// log html
function logH(cb) {
  console.log(html)
  console.log('test2')
  cb()
}

gulp.task(grow)
gulp.task('default', gulp.series(
  grow,
  templates,
  logH
  // cb => cb(applyTemplates(forest))
))
