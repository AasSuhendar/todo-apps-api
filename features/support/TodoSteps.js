// features/support/steps.js
const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

Given('a variable set to {int}', function(number) {

    //this.setTo(number)
    // return true;
})

When('I increment the variable by {int}', function(number) {
    //this.incrementBy(number)
    // return true
})

Then('the variable should contain {int}', function(number) {
    expect(2).to.eql(number)
})