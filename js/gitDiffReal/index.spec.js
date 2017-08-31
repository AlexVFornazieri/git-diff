'use strict'

var imp = require('../../test/_js/testImports')
var gitDiffReal = require('./index')

var GREEN = '\u001b[32m'
var RED = '\u001b[31m'
var str1 = imp.data.str1
var str2 = imp.data.str2

describe('gitDiffReal', function() {

  var DEFAULTS, sandbox

  describe('real is available', function() {

    before(function() {
      imp.loglevel.setLevel('silent')
    })

    beforeEach(function() {
      delete require.cache[require.resolve('../_shared/defaultOptions')]
      DEFAULTS = require('../_shared/defaultOptions')
      sandbox = imp.sinon.sandbox.create()
      sandbox.spy(imp.loglevel, 'info')
      sandbox.spy(imp.loglevel, 'warn')
    })

    afterEach(function() {
      sandbox.restore()
    })

    describe('line difference', function() {

      before(function() {
        if (!imp.keepIt.real()) this.skip()
      })

      it('color', function() {
        var actual = gitDiffReal(str1, str2, {color: true, wordDiff: false})
        imp.expect(actual).to.include(RED)
        imp.expect(actual).to.include(GREEN)
      })

      it('no color', function() {
        var expected = imp.data.lineDiffRealVim
        var actual = gitDiffReal(str1, str2, {color: false, wordDiff: false})
        imp.expect(actual).to.equal(expected)
        imp.expect(actual).to.not.include(RED)
        imp.expect(actual).to.not.include(GREEN)
      })

      it('one liner', function() {
        var expected = imp.data.oneLinerLineDiffReal
        var actual = gitDiffReal('my first string', 'my second string', {color: false, wordDiff: false})
        imp.expect(actual).to.equal(expected)
      })

      it('no difference', function() {
        var actual = gitDiffReal('', '', {wordDiff: false})
        imp.expect(actual).to.be.undefined
      })
    })

    describe('word difference', function() {

      before(function() {
        if (!imp.keepIt.real()) this.skip()
      })

      it('color', function() {
        var actual = gitDiffReal(str1, str2, {color: true, wordDiff: true})
        imp.expect(actual).to.include(RED)
        imp.expect(actual).to.include(GREEN)
      })

      it('no color', function() {
        var expected = imp.data.wordDiffReal
        var actual = gitDiffReal(str1, str2, {color: false, wordDiff: true})
        imp.expect(actual).to.equal(expected)
        imp.expect(actual).to.not.include(RED)
        imp.expect(actual).to.not.include(GREEN)
      })

      it('one liner', function() {
        var expected = imp.data.oneLinerWordDiffReal
        var actual = gitDiffReal('my first string', 'my second string', {color: false, wordDiff: true})
        imp.expect(actual).to.equal(expected)
      })

      it('no difference', function() {
        var actual = gitDiffReal('', '', {wordDiff: true})
        imp.expect(actual).to.be.undefined
      })
    })

    describe('flags', function() {

      before(function() {
        if (!imp.keepIt.real()) this.skip()
      })

      it('valid', function() {
        var expected = imp.data.shortstatReal
        var actual = gitDiffReal(str1, str2, {color: false, flags: '--shortstat'})
        imp.expect(actual).to.equal(expected)
        imp.expect(imp.loglevel.warn).to.have.not.been.called
        imp.expect(imp.loglevel.info).to.have.not.been.called
      })

      it('invalid', function() {
        var actual = gitDiffReal(str1, str2, {color: false, flags: '--oops'})
        var expected = imp.data.lineDiffRealVim
        imp.expect(actual).to.equal(expected)
        imp.expect(imp.loglevel.warn).to.have.been.calledWith('Ignoring invalid git diff options: --oops')
        imp.expect(imp.loglevel.info).to.have.been.calledWith('For valid git diff options refer to https://git-scm.com/docs/git-diff#_options')
      })

      it('invalid with valid default', function() {
        DEFAULTS.flags = '--shortstat'
        var actual = gitDiffReal(str1, str2, {color: false, flags: '--oops'})
        var expected = imp.data.shortstatReal
        imp.expect(actual).to.equal(expected)
        imp.expect(DEFAULTS.flags).to.equal('--shortstat')
        imp.expect(imp.loglevel.warn).to.have.been.calledWith('Ignoring invalid git diff options: --oops')
        imp.expect(imp.loglevel.info).to.have.been.calledWith('For valid git diff options refer to https://git-scm.com/docs/git-diff#_options')
        imp.expect(imp.loglevel.info).to.have.been.calledWith('Using default git diff options: --shortstat')
      })

      it('invalid with invalid default', function() {
        DEFAULTS.flags = '--oops'
        var actual = gitDiffReal(str1, str2, {color: false, flags: '--oops'})
        var expected = imp.data.lineDiffRealVim
        imp.expect(actual).to.equal(expected)
        imp.expect(DEFAULTS.flags).to.equal(null)
        imp.expect(imp.loglevel.warn).to.have.been.calledWith('Ignoring invalid git diff options: --oops')
        imp.expect(imp.loglevel.info).to.have.been.calledWith('For valid git diff options refer to https://git-scm.com/docs/git-diff#_options')
        imp.expect(imp.loglevel.info).to.not.have.been.calledWithMatch(/Using default git diff options/)
      })
    })
  })

  describe('real is unavailable', function() {

    beforeEach(function() {
      sandbox = imp.sinon.sandbox.create()
      sandbox.stub(imp.keepIt, 'real').returns(false)
    })

    afterEach(function() {
      sandbox.restore()
    })

    it('line difference', function() {
      var actual = gitDiffReal(str1, str2, {color: false, wordDiff: false})
      imp.expect(actual).to.be.undefined
    })

    it('word difference', function() {
      var actual = gitDiffReal(str1, str2, {color: false, wordDiff: true})
      imp.expect(actual).to.be.undefined
    })
  })
})
