//Budget controller
let budgetController = (function () {
  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type){
    let sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },

    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1

  };
  return {
    addItem: function (type, des, val) {
      let newItem, ID;
      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;

    },

    calculateBudget : function(){
      //calculate total income and expenses
calculateTotal('exp');
calculateTotal('inc');

      //calculate the budget : income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the percentage of income that we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else{
        data.percentage = -1;
      }

    },
    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }

    },

    testing: function () {
      console.log(data);
    }
  };

})();
//UI CONTROLLER
let UIController = (function () {
  let DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer : '.income__list',
    expensesContainer : '.expenses__list',
    budgetLabel : '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage'


  };
  return {
    getinput: function () {
      return {

        type: document.querySelector(DOMstrings.inputType).value,//either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      };

    },

    addListItem: function (obj, type) {
      let html, newHtml,element;

      // Create HTML string with placeholder text

      if (type ==='inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

      }else if (type ==='exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'

      }



      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%' , obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // Insert the HTML into the DOM

      document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);


    },
    clearFields:function(){
      let fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +DOMstrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields)

      fieldsArr.forEach(function(cur){
        cur.value = '';

      });
      fieldsArr[0].focus();

    },
    displayBudget: function(obj){
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;


      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+ '%';
      }
        else{
          document.querySelector(DOMstrings.percentageLabel).textContent = '---'
        }
      },




    getDOMstrings: function () {
      return DOMstrings;
    }

  };

})();
//GLOBAL APP CONTROLLER
let controller = (function (budgetCtrl, UICtrl) {

  let setupEventListners = function () {

    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13) {
        ctrlAddItem();
      }

    });

  };
  let updateBudget = function(){
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. return the budget
    let budget = budgetCtrl.getBudget();

    //3. display the budget on the UI

UICtrl.displayBudget(budget);

  }


  let ctrlAddItem = function () {
    let input, newItem;


    console.log(input);
//1. get the field input data
    input = UICtrl.getinput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      //2. add the item to the budget controller

      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
//3. add the item to the ui
      UICtrl.addListItem(newItem, input.type);


      // 4. clear fields
      UICtrl.clearFields();

      //5. Calculate and update budget
      updateBudget();



    }



  };
  return {
    init: function () {
      console.log('started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1

      });
      setupEventListners();
    }
  };

})(budgetController, UIController);

controller.init();
