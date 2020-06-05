var budgetController = (function () {
    var Expence = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expence.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
    };
    Expence.prototype.getPercentage = function () {
        return this.percentage;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum += curr.value;
        })
        /*
        0
        [200,400,100]
        sum = 0 +200
        sum=200+400
        sum =600+100             
        */
        data.totals[type] = sum;

    }
    var data = {
        allItems: {
            exp: [], // arrays with expences/incomes object
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1// way to show that something isn't exist
    }
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            ID = 0;

            // Create new ID 
            // [1 2 3 4 5] , next ID =6
            //[1 2 3 4 6 8], next id = 9
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                //ID = last ID +1
            } else {
                ID = 0;
            }
            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expence(ID, des, val);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Push ot into our data structure
            data.allItems[type].push(newItem);
            //Return the new element
            return newItem;

        },

        deleteItem: function (type, id) {
            var ids, index;
            // id =6;- that we looking for
            // ids =[1 2  4 6 8], next id = 9
            // index=3
            ids = data.allItems[type].map(function (current) {
                // map method receive callback function
                //return new array
                console.log(current.id)
                return current.id;
            });
            console.log(ids)
            index = ids.indexOf(id);//takes ID as number from clicked ID, and find it in array
            console.log(index)
            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function () {

            //1) summarize all members of array for expences and incomes
            calculateTotal('exp')
            calculateTotal('inc')

            // calculate budget in numbers(income-expences)
            data.budget = data.totals.inc - data.totals.exp;

            // calculate how many percentages expences from incomes
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }



        },
        calculatePercentages: function () {
            /* 
            a=20
            b=10
            c=40
            income =100
            */
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc)
            })

        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data)
        }


    }
})()// IIFE independent module, but because
// of closure we can acces  desirable variables using publicTest directly 
// module pattern. budgetController is simly object that has all methods 
//that was returned to it


var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenceContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenceLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expencesPercLabel: '.item__percentage'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,// will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            }

        }, addListItem: function (obj, type) {
            var html, newHtml, element;
            // Create html string with place holder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === 'exp') {
                element = DOMstrings.expenceContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }// we take big prepared piece of html code saved as a string into a variable
            // then we used replace method, and we will replace same part of string with
            // input properties of object(income or expence).

            // Replace the place holder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM
            // console.log('its adds')
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = '+ ' + obj.totalInc
            document.querySelector(DOMstrings.expenceLabel).textContent = '- ' + obj.totalExp
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + ' %'
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage = '---'
            }
            //console.log(budgetUI +'budget'+ incomeUI +'income'+ expencesUI+'expences'+ }percentageUI+ 'percentage')

        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expencesPercLabel);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            };
            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';

                } else {
                    current.textContent = '---'
                }


            });

        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            // console.log(el)
        },
        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);// trick to save list as an array. slice method creates a copy of array, but it doesn't work with lists
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
                current.description = "";
            });
            //console.log( fields)
            //console.log(fieldsArray )
            fieldsArray[0].focus();// возвращает обратно фокус
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();



//
var controler = (function (budgCtrl, UICtrl) {
    function setupEventListeners() {
        var DOM = UICtrl.getDOMstrings();
        //  console.log(typeof DOM.inputValue)
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrAddItem)
        // instead of anonymuos function above we added fucntion
        // where we put same code to avoid code duplication
        document.addEventListener('keypress', function (event) {//or 'e'
            if (event.keyCode === 13 || event.which === 13) {//using keyCode for certain button
                ctrAddItem()

            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)//
        //set up on first common parent for 
        //e=incomes and expences area event, then down we will only to click area
    }
    var updateBudget = function () {
        //1.Calculate budget
        budgCtrl.calculateBudget();
        // 2. Return the  budget
        var budget = budgCtrl.getBudget();
        //3. Display the budget the UI
        //console.log(budget)
        UIController.displayBudget(budget)
    }
    var updatePercentages = function () {
        //1) Calculate percentages
        budgCtrl.calculatePercentages();

        //2) Read percantages from the budget controller
        var percentages = budgCtrl.getPercentages();

        //3) Update the UI with the new percantages
        UIController.displayPercentages(percentages)

    }
    var ctrAddItem = function () {
        var input, newItem;
        //1.Get filled input data
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //console.log(input)
            //console.log(typeof input)

            //2.Add the item to the budget controller
            newItem = budgCtrl.addItem(input.type, input.description, input.value)


            //3.Add the item to the UI
            UIController.addListItem(newItem, input.type)
            //4.Clear the fields
            UIController.clearFields()
            //5.Calculate budget
            updateBudget()
            // 6. Calculate and update percanteges
            updatePercentages()
        }
    }
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        // console.log(itemID)
        //traversing of DOM structure
        if (itemID) {
            //inc-1
            splitID = itemID.split('-')
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. delete the item from data structure
            budgCtrl.deleteItem(type, ID)
            //2. delete the item from the UIController
            UICtrl.deleteListItem(itemID)
            //3. Update and show the new budget
            updateBudget();
            // 4. Calculate and update percanteges
            updatePercentages()

        }

    }
    return {
        init: function () {
            console.log('Application was run')
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners();
        }
    }


})(budgetController, UIController);
//keycodes
controler.init();