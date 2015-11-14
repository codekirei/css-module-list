'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const Sequelize = require('sequelize')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
const sequelize = new Sequelize('sqlite://modules.db')

const Module = sequelize.define('module', {
  name: {
    type: Sequelize.STRING
  }
})

Module.sync()
  .then(() => {
    return Module.create({
      name: 'test'
    })
  })
