'use strict'

// modules
const fs = require('fs')
const jsDiff = require('diff')

// read and diff files
const diff = jsDiff.diffLines(
  fs.readFileSync('all-modules.txt', 'utf8'),
  fs.readFileSync('latest.txt', 'utf8')
)

// log diffs
diff.length > 1
  ? console.log(diff[1].value)
  : console.log('no new modules')
