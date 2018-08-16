'use strict'

var express = require('express')
var braintree = require('braintree')
var router = express.Router() // eslint-disable-line new-cap
var gateway = require('../config/braintreegateway')
var flash = require('connect-flash')
var User = require('../models/user')

var TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
]
router.use(flash())

function formatErrors (errors) {
  var formattedErrors = ''

  for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n'
    }
  }
  return formattedErrors
}

function createResultObject (transaction) {
  var result
  var status = transaction.status

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
    }
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: 'Your test transaction has a status of ' + status + '. See the Braintree API response and try again.'
    }
  }

  return result
}

router.get('/', function (req, res) {
  req.session.subscription_expire = req.query.subscription_date
  gateway.clientToken.generate({}, function (err, response) {
    // res.sendFile(path.join(__dirname + '/../views/paymentPage.html'), {clientToken: response.clientToken, messages: req.flash('error')})
    res.render('paymentPage.jade', {clientToken: response.clientToken, messages: req.flash('error')})
  })
})

router.get('/:id', function (req, res, next) {
  var result
  var transactionId = req.params.id
  console.log(req.session)
  gateway.transaction.find(transactionId, function (err, transaction) {
    if (!transaction) {
      req.flash('error', 'Password reset token is invalid or has expired.')
      return res.redirect('back')
    }

    result = createResultObject(transaction)
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error)
        } else {
          if (user === null) {
            let err = new Error('Not authorized! Go back!')
            err.status = 400
            return next(err)
          } else {
            user.subscription = 'True'
            user.subscription_expire = req.session.subscription_expire
            user.save()
          }
        }
      })
    res.render('show.jade', {transaction: transaction, result: result})
  })
})

router.post('/', function (req, res) {
  var transactionErrors
  var amount = req.body.amount // In production you should not take amounts directly from clients
  var nonce = req.body.payment_method_nonce

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.redirect('payments/' + result.transaction.id)
    } else {
      transactionErrors = result.errors.deepErrors()
      req.flash('error', {msg: formatErrors(transactionErrors)})
      res.redirect('new')
    }
  })
})

module.exports = router
