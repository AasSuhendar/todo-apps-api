const { setWorldConstructor } = require('cucumber')

class CustomWorld {
  constructor () {
    this.variable = 0
    this.data
    this.message = ''
    this.todo = ''
    this.body
  }

  setTo (number) {
    this.variable = number
  }

  setToDo (newTodo) {
    this.todo = newTodo
  }

  setToJSON (jsonData) {
    this.body = JSON.parse(jsonData)
  }

  setReturnRespons (dataReturn) {
    this.data = dataReturn
  }

  setReturnMessage (dataMessage) {
    this.message = dataMessage
  }

  getReturnMessage () {
    return this.message
  }

  incrementBy (number) {
    this.variable += number
  }
}

setWorldConstructor(CustomWorld)
