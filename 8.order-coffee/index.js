let btn = document.querySelector('.add-button');
let number = 1;
let done = document.querySelector('.submit-button');
let words = ["срочно", "побыстрее", "быстрее", "поскорее", "скорее", "очень нужно"];
document.querySelector('textarea').addEventListener('blur', updateText);
addRemoveListener(document.querySelector('.beverage'));

function addDrink() {
    let drink = document.querySelector('.beverage').cloneNode(true);
    updateMilkName(drink, number);
    drink.querySelector('.beverage-count').textContent = `Напиток №${++number}`;
    drink.querySelector('.wishes').querySelector('textarea').value = '';
    drink.querySelector('.wishes').querySelector('p').textContent = '';
    btn.insertAdjacentElement('beforeBegin', drink);
    drink.querySelector('textarea').addEventListener('blur', updateText);
    addRemoveListener(drink);
}
btn.addEventListener('click', addDrink);

function removeDrink(event) {
    if (number !== 1) {
        number--;
        event.target.parentElement.remove();
    }

    updateDrinkNumbers();
    updateMilkName(event.target.parentElement, number)
}

function updateMilkName(element, number) {
    let fields = element
        .querySelectorAll('.field')[1]
        .querySelectorAll('.checkbox-field');
    for (let checkbox of fields) {
        checkbox.querySelector('input').setAttribute('name',`milk${number}`);
    }
}

function updateDrinkNumbers() {
    const drinks = document.querySelectorAll('.beverage');
    for (let i = 1 ; i <= drinks.length; i++) {
        drinks[i - 1].querySelector('.beverage-count').textContent = `Напиток №${i}`;
        updateMilkName(drinks[i - 1], i);
    }
}

function addRemoveListener(element) {
    element.querySelector('.removeDrink').addEventListener('click', (event) => removeDrink(event));
}

function doneModal() {
    document.querySelector('.modal').style.display = "block";
    document.querySelector('.modal').querySelector('p').textContent = `Вы заказали ${number} ${sklon(number)}`;
    generateTableRows();
}
done.addEventListener('click', doneModal);

function closeModal() {
    document.querySelector('.modal').style.display = "none"
}
document.querySelector('.close').addEventListener('click', closeModal);

function sklon(number) {
    if (number % 10 === 1) {
        return 'напиток'
    }

    if (number % 10 === 2 || number % 10 === 3 || number % 10 === 4) {
        return 'напитка'
    }

    return 'напитков'
}
function generateTableRows() {
    let elem = document.querySelector('.modal').querySelector('table').querySelector('tbody').querySelectorAll('tr');
    for (let tr of elem) {
        tr.remove();
    }
    let drinks = document.querySelectorAll('.beverage');
    for (const drink of drinks) {
        let drinkName = drink.querySelectorAll('option:checked')[0].text;
        let milkName = drink.querySelector('.milk > input:checked').value;
        //здесь нужно реализовать словарь для удобства 
        if (milkName === 'usual') {
            milkName = 'обычное';
        } else if (milkName === 'no-fat') {
            milkName = 'обезжиренное';
        } else if (milkName === 'soy'){
            milkName = 'соевое';
        } else {
            milkName = 'кокосовое';
        }
        let additions = drink.querySelectorAll('.options > input:checked');
        let additionsNames = [];
        for (let i = 0; i < additions.length; i++) {
            if (additions[i].value === 'whipped cream') {
                additionsNames.push('взбитые сливки');
            } else if (additions[i].value === 'marshmallow') {
                additionsNames.push('зефирки');
            } else if (additions[i].value === 'chocolate'){
                additionsNames.push('шоколад');
            } else if (additions[i].value === 'cinnamon') {
                additionsNames.push('корица');
            }
        }
        let wishes = drink.querySelector('.wishes').querySelector('textarea').value;
        createRow(drinkName, milkName, additionsNames.join(', '), wishes);
    }
}
function createRow(drinkName, milkName, additionsNames, wishes) {
    let elem = document.querySelector('.modal').querySelector('table').querySelector('tbody');
    let tr = document.createElement('tr');
    elem.appendChild(tr);
    for (let i = 0; i < 4; i++) {
        let td = document.createElement('td');
        if (i === 0) {
            td.appendChild(document.createTextNode(drinkName));
        } else if (i === 1) {
            td.appendChild(document.createTextNode(milkName));
        } else if (i === 2) {
            td.appendChild(document.createTextNode(additionsNames));
        } else {
            td.appendChild(document.createTextNode(wishes));
        }

        tr.appendChild(td);
    }
}

function updateText(event) {
    let elem = event.target.parentElement.parentElement.querySelector('p');
    elem.textContent = event.target.value;
    let str = elem.textContent;
    for (let i = 0; i < words.length; i++) {
        let index = str.toLowerCase().indexOf(words[i]);
        while (index !== -1) {
            str = str.substring(0,index) + "<b>"
                + str.substring(index,index + words[i].length)
                + "</b>" + str.substring(index + words[i].length);
            index = str.toLowerCase().indexOf(words[i], index + 4);
        }
    }
    elem.innerHTML = str;
}

function timeCheck() {
    let time = document.querySelector('.timeOfOrder').value;
    let day = new Date();
    if ((+(time[0] + time[1]) < day.getHours()) || (+(time[0] + time[1]) === day.getHours() && +(time[3] + time[4]) < day.getMinutes())) {
        document.querySelector('.timeOfOrder').style.borderColor = 'red';
        alert("Мы не умеем перемещаться во времени. Выберите время позже, чем текущее");
    } else {
        closeModal();
    }
}
document.querySelector('.formalize').addEventListener('click', timeCheck);
