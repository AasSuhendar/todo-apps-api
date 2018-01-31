// features/support/steps.js
const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

Given('Melani memiliki pekerjaan yang harus dimasukan ke sistem dengan judul {string}',
  function (title, callback) {
    // Write code here that turns the phrase above into concrete actions

    // callback(null, 'pending')
    expect('Menyiapkan ruang rapat').to.eql(title)
  })

When('Melani memasukan pekerjaan', function (newTodo, callback) {
  // Write code here that turns the phrase above into concrete actions
  //   callback(null, 'pending')
  // return true
})

Then('Sistem menyimpan pekerjaan tersebut dan menampilkan pesan {string}', function (string, callback) {
  // Write code here that turns the phrase above into concrete actions
  //   callback(null, 'pending')
})
