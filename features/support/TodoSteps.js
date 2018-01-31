// features/support/steps.js
const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

Given('Melani memiliki pekerjaan yang harus dimasukan ke sistem dengan judul {string}',
  function (title) {
    // Write code here that turns the phrase above into concrete actions

    // callback(null, 'pending')
    // expect('Menyiapkan ruang rapat').to.eql(title)
    expect('Menyiapkan ruang rapat').to.equal(title)
  })

When('Melani memasukan pekerjaan', function (newTodo) {
  // Write code here that turns the phrase above into concrete actions
  //   callback(null, 'pending')
  // return true
})

Then('Sistem menyimpan pekerjaan tersebut dan menampilkan pesan {string}', function (message) {
  // Write code here that turns the phrase above into concrete actions
  //   callback(null, 'pending')
  expect('Sukses Menyimpan Pekerjaan').to.equal(message)
})
