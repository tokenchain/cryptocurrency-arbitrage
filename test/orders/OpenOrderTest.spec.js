'use strict'

const User = require('./Order')  
const expect = require('chai').expect

describe('Order module', () => {  
  describe('"create"', () => {
    it('should export a function', () => {
      expect(Order.create).to.be.a('function')
    })
  })
})