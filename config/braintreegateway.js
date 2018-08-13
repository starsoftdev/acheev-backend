'use strict'

var braintree = require('braintree')
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '566m8qnrc89k4b2x',
  publicKey: 'ndsvpwzrm7dx4ft5',
  privateKey: 'b23ec944e5451db6f905675bd09797ce'
})

module.exports = gateway
