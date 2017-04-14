'use strict'
var test = require('tape')

var utf8text = 'УТФ-8 text'

module.exports = function (name, createHash) {
  test(name + ' Blake#_transform', function (t) {
    t.test('should use Blake#update', function (t) {
      var hash = createHash('blake256')

      t.plan(3)
      hash.update = function () {
        t.same(arguments[0], utf8text)
        t.same(arguments[1], 'utf8')
      }
      hash._transform(utf8text, 'utf8', function (err) { t.same(err, null) })
      t.end()
    })

    t.test('should handle error in Blake#update', function (t) {
      var hash = createHash('blake256')
      var err = new Error('42')

      t.plan(1)
      hash.update = function () { throw err }
      hash._transform(new Buffer(0), 'buffer', function (_err) { t.true(_err === err) })
      t.end()
    })

    t.end()
  })

  test(name + ' Blake#_flush', function (t) {
    t.test('should use Blake#digest', function (t) {
      var hash = createHash('blake256')
      var buffer = new Buffer(0)

      t.plan(2)
      hash.push = function (data) { t.true(data === buffer) }
      hash.digest = function () { return buffer }
      hash._flush(function (err) { t.same(err, null) })
      t.end()
    })

    t.test('should handle errors in Blake#digest', function (t) {
      var hash = createHash('blake256')
      var err = new Error('42')

      t.plan(1)
      hash.digest = function () { throw err }
      hash._flush(function (_err) { t.true(_err === err) })
      t.end()
    })

    t.end()
  })

  test(name + ' Blake#update', function (t) {
    t.test('only string or buffer is allowed', function (t) {
      var hash = createHash('blake256')

      t.throws(function () {
        hash.update(null)
      }, /^TypeError: Data must be a string or a buffer$/)
      t.end()
    })

    t.test('should throw error after Blake#digest', function (t) {
      var hash = createHash('blake256')

      hash.digest()
      t.throws(function () {
        hash.update('')
      }, /^Error: Digest already called$/)
      t.end()
    })

    t.test('should return `this`', function (t) {
      var hash = createHash('blake256')

      t.same(hash.update(new Buffer(0)), hash)
      t.end()
    })

    t.end()
  })

  test(name + ' Blake#digest', function (t) {
    t.test('should throw error on second call', function (t) {
      var hash = createHash('blake256')

      hash.digest()
      t.throws(function () {
        hash.digest()
      }, /^Error: Digest already called$/)
      t.end()
    })

    t.test('should return buffer by default', function (t) {
      var hash = createHash('blake256')

      t.true(Buffer.isBuffer(hash.digest()))
      t.end()
    })

    t.test('should encode result with custom encoding', function (t) {
      var hash = createHash('blake256')

      var digest = hash.digest('hex')
      t.equal(typeof digest, 'string')
      t.equal(digest.length, 64)
      t.end()
    })

    t.end()
  })
}
