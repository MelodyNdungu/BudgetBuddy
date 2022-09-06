class Expense {
  constructor(year, month, day, type, description, cost) {
    this.year = year
    this.month = month
    this.day = day
    this.type = type
    this.description = description
    this.cost = cost
  }

  
  dataValidation() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return 1
      } else if (
        (parseInt(this.month) === 1 && parseInt(Math.round(this.day)) > 31) ||
        (parseInt(this.month) === 3 && parseInt(Math.round(this.day)) > 31) ||
        (parseInt(this.month) === 5 && parseInt(Math.round(this.day)) > 31) ||
        (parseInt(this.month) === 7 && parseInt(Math.round(this.day)) > 31) ||
        (parseInt(this.month) === 8 && parseInt(Math.round(this.day)) > 31) ||
        (parseInt(this.month) === 10 && parseInt(Math.round(this.day)) > 31) ||
        (parseInt(this.month) === 12 && parseInt(Math.round(this.day)) > 31) ||
        (parseInt(this.month) === 4 && parseInt(Math.round(this.day)) > 30) ||
        (parseInt(this.month) === 6 && parseInt(Math.round(this.day)) > 30) ||
        (parseInt(this.month) === 9 && parseInt(Math.round(this.day)) > 30) ||
        (parseInt(this.month) === 11 && parseInt(Math.round(this.day)) > 30) ||
        (parseInt(this.year) % 4 === 0 &&
          parseInt(this.month) === 2 &&
          parseInt(Math.round(this.day)) > 29) ||
        (parseInt(this.year) % 4 !== 0 &&
          parseInt(this.month) === 2 &&
          parseInt(Math.round(this.day)) > 28) ||
        parseInt(Math.round(this.day)) < 1 ||
        isNaN(parseInt(this.day))
      ) {
        return 2
      } else if (parseFloat(this.cost) < 0 || isNaN(parseFloat(this.cost))) {
        return 3
      }
      return 0
    }
  }
}

class Db {
  constructor() {
    let id = localStorage.getItem('id')

    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  getNextId() {
    let nextId = localStorage.getItem('id')
    return parseInt(nextId) + 1
  }

  engrave(d) {
    let id = this.getNextId()

    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)
  }

  
  allRecords() {
    
    let expenses = []
    let id = localStorage.getItem('id')

    for (let i = 1; i <= id; i++) {
      
      let expense = JSON.parse(localStorage.getItem(i))

      if (expense === null) {
        continue
      }

      expense.id = i

      expenses.push(expense)
    }
    return expenses
  }

  search(expense) {
    let filteredExpenses = []
    filteredExpenses = this.allRecords()

    if (expense.year != '') {
      filteredExpenses = filteredExpenses.filter(e => e.year == expense.year)
    }

    if (expense.month != '') {
      filteredExpenses = filteredExpenses.filter(e => e.month == expense.month)
    }

    if (expense.day != '') {
      filteredExpenses = filteredExpenses.filter(e => e.day == expense.day)
    }

    if (expense.type != '') {
      filteredExpenses = filteredExpenses.filter(e => e.type == expense.type)
    }

    if (expense.description != '') {
      filteredExpenses = filteredExpenses.filter(
        e => e.description == expense.description
      )
    }

    if (expense.cost != '') {
      filteredExpenses = filteredExpenses.filter(e => e.cost == expense.cost)
    }

    return filteredExpenses
  }

  remove(id) {
    localStorage.removeItem(id)
  }
}

let db = new Db()

function registerExpense() {
  let year = document.getElementById('year')
  let month = document.getElementById('month')
  let day = document.getElementById('day')
  let type = document.getElementById('type')
  let description = document.getElementById('description')
  let cost = document.getElementById('cost')

  let expense = new Expense(
    year.value,
    month.value,
    parseInt(Math.round(day.value)),
    type.value,
    description.value,
    parseFloat(cost.value)
  )

  
  if (expense.dataValidation() === 0) {
    // successful

    // register to
    db.engrave(expense)

    // pop up of registration entered
    document.getElementById('modal-title').innerHTML = 'Registred!'
    document.getElementById('modal-title-div').className =
      'modal-header text-success'
    document.getElementById('modal-content').innerHTML =
      'Expense successfully added'
    document.getElementById('modal-btn').innerHTML = 'Go back'
    document.getElementById('modal-btn').className = 'btn btn-success'
    $('#engraveRegister').modal('show')

    
    year.value = ''
    month.value = ''
    day.value = ''
    type.value = ''
    description.value = ''
    cost.value = ''
  } else if (expense.dataValidation() === 1) {
    // erro (campos em barnco)
    document.getElementById('modal-title').innerHTML = 'Error'
    document.getElementById('modal-title-div').className =
      'modal-header text-danger'
    document.getElementById('modal-content').innerHTML =
      'Please, fill all the fields'
    document.getElementById('modal-btn').innerHTML = 'Go back and fix it'
    document.getElementById('modal-btn').className = 'btn btn-danger'
    $('#engraveRegister').modal('show')
  } else if (expense.dataValidation() === 2) {
    // erro (dia inválido)
    document.getElementById('modal-title').innerHTML = 'Error'
    document.getElementById('modal-title-div').className =
      'modal-header text-danger'
    document.getElementById('modal-content').innerHTML =
      'Please, enter a valid day'
    document.getElementById('modal-btn').innerHTML = 'Go back and fix it'
    document.getElementById('modal-btn').className = 'btn btn-danger'
    $('#engraveRegister').modal('show')
  } else if (expense.dataValidation() === 3) {
    // erro (dia inválido)
    document.getElementById('modal-title').innerHTML = 'Error'
    document.getElementById('modal-title-div').className =
      'modal-header text-danger'
    document.getElementById('modal-content').innerHTML =
      'Please, enter a valid cost value'
    document.getElementById('modal-btn').innerHTML = 'Go back and fix it'
    document.getElementById('modal-btn').className = 'btn btn-danger'
    $('#engraveRegister').modal('show')
  }
}

function loadExpenses() {
  let expenses = []
  expenses = db.allRecords()


  let expensesList = document.getElementById('expensesList')


  expenses.forEach(function (d) {
    // row addition of expenses
    let row = expensesList.insertRow()

    // specification of expenditure
    row.insertCell(0).innerHTML = `${fixZero(parseInt(d.day))}/${fixZero(
      parseInt(d.month)
    )}/${d.year}`
    switch (parseInt(d.type)) {
      case 1:
        d.type = 'Food'
        break
      case 2:
        d.type = 'Education'
        break
      case 3:
        d.type = 'Leisure'
        break
      case 4:
        d.type = 'Health'
        break
      case 5:
        d.type = 'Transportation'
        break
    }
//currency specification
    var formatter = new Intl.NumberFormat('en-KE', {
      symbol: "ke",
      style: 'currency',
        _currency: 'KES',
      get currency() {
          return this._currency
      },
      set currency(value) {
          this._currency = value
      },
    })
    row.insertCell(1).innerHTML = d.type
    row.insertCell(2).innerHTML = d.description
    row.insertCell(3).innerHTML = formatter.format(d.cost)

   
    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
 
    btn.onclick = function () {
      let id = this.id.replace('expense-id-', '')

      document.getElementById('modal-title').innerHTML = 'Attention!'
      document.getElementById('modal-title-div').className =
        'modal-header text-dark'
      document.getElementById('modal-content').innerHTML =
        'Are you sure you want to remove this register?'
      document.getElementById('modal-btn-cancel').innerHTML = 'Cancel'
      document.getElementById('modal-btn-cancel').className = 'btn btn-dark'
      document.getElementById('modal-btn-confirm').innerHTML = 'Yes, delete'
      document.getElementById('modal-btn-confirm').className = 'btn btn-danger'
      document.getElementById('modal-btn-confirm').onclick = function () {
        db.remove(id)
        searchExpense()
      }
      $('#engraveRegister').modal('show')
    }
    row.insertCell(4).append(btn)
  })
}

function searchExpense() {
  let year = document.getElementById('year').value
  let month = document.getElementById('month').value
  let day = document.getElementById('day').value
  let type = document.getElementById('type').value
  let description = document.getElementById('description').value
  let cost = document.getElementById('cost').value

  
  let expense = new Expense(year, month, day, type, description, cost)

  let expenses = db.search(expense)

  let expensesList = document.getElementById('expensesList')

  expensesList.innerHTML = ''

  
  expenses.forEach(function (d) {
   
    let row = expensesList.insertRow()

    row.insertCell(0).innerHTML = `${fixZero(parseInt(d.day))}/${fixZero(
      parseInt(d.month)
    )}/${d.year}`

    switch (parseInt(d.type)) {
      case 1:
        d.type = 'Food'
        break
      case 2:
        d.type = 'Education'
        break
      case 3:
        d.type = 'Leisure'
        break
      case 4:
        d.type = 'Health'
        break
      case 5:
        d.type = 'Transportation'
        break
    }
    //Currency specification
    var formatter = new Intl.NumberFormat('en-KE', {
      style: 'currency',
       currency: 'KES'
     })
    row.insertCell(1).innerHTML = d.type
    row.insertCell(2).innerHTML = d.description
    row.insertCell(3).innerHTML = formatter.format(d.cost)

    //alert box
    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
  
    btn.id = `expense-id-${d.id}`
    btn.onclick = function () {
      let id = this.id.replace('expense-id-', '')

      document.getElementById('modal-title').innerHTML = 'Attention!'
      document.getElementById('modal-title-div').className =
        'modal-header text-dark'
      document.getElementById('modal-content').innerHTML =
        'Are you sure you want to remove this register?'
      document.getElementById('modal-btn-cancel').innerHTML = 'Cancel'
      document.getElementById('modal-btn-cancel').className = 'btn btn-dark'
      document.getElementById('modal-btn-confirm').innerHTML = 'Yes, delete'
      document.getElementById('modal-btn-confirm').className = 'btn btn-danger'
      document.getElementById('modal-btn-confirm').onclick = function () {
        db.remove(id)
        searchExpense()
      }

      $('#engraveRegister').modal('show')
    }
    row.insertCell(4).append(btn)
  })
}

function reloadPage() {
  window.location.reload()
}

function fixZero(date) {
  if (date < 10) {
    return '0' + date
  } else {
    return date
  }
}
