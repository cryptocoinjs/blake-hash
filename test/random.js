'use strict'
var test = require('tape')
var XorShift128Plus = require('xorshift.js').XorShift128Plus

var seed = '27f098d21ca458d4033e3ea269db8b27'
var prng = new XorShift128Plus(seed)

module.exports = function (bindings, purejs) {
  var hashes = [
    'blake224',
    'blake256',
    'blake384',
    'blake512'
  ]

  function getHash (engine, name, bytes) {
    return engine(name).update(bytes).digest('hex')
  }

  hashes.forEach(function (name) {
    test('random tests: ' + name, function (t) {
      for (var i = 0; i < 25; ++i) {
        var size = prng.randomInt64()[1] % 32768 // not more than 32KiB
        if (i === 0) size = 55 // special case

        var bytes = prng.randomBytes(size)
        t.equal(getHash(bindings, name, bytes), getHash(purejs, name, bytes))
      }

      t.end()
    })
  })
}
