'use strict'

// Module dependencies.
var Joi = require('joi')

function deputy (plugin) {
  var attrs = plugin.register.attributes

  function register (server, options, next) {
    if (plugin.validate) {
      try {
        options = Joi.attempt(options, plugin.validate.schema, plugin.validate.message)
      } catch (err) {
        return next(err)
      }
    }

    if (!attrs.dependencies || !attrs.dependencies.length) {
      return plugin.register(server, options, next)
    }

    server.dependency(attrs.dependencies, function (server, next) {
      plugin.register(server, options, next)
    })

    next()
  }

  register.attributes = attrs

  return {
    register: register
  }
}

module.exports = deputy
