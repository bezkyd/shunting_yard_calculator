const inputField = document.querySelector("#input-field");
const buttonsGroup = document.querySelector("#buttons-group");

let currentInput = '';


buttonsGroup.addEventListener('click', (event) => {
    const button = event.target;

    if (button.tagName !== 'BUTTON') return;
    const value = button.textContent;

    handleInput(value);
});

function handleInput(value) {
    const operators = ['+', '-', '/', '*', '(', ')', '.'];
    if (value === "C") {
        allClear();
    } 
    else if (value === "DEL") { deleteLast(); } 
    else if (operators.includes(value) || !isNaN(value)) {
        appendValue(value);
    }
    else if (value === "=") { 
        currentInput = calculate(currentInput);
        updateDisplay();
    }
}

// function isValidChar(value) { pass; }
function allClear () { 
    currentInput = ''; 
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();    
}


function appendValue(value) {
    const lastChar = currentInput.slice(-1);
    const operators = ['+', '-', '×', '÷', '*', '/'];

    if (operators.includes(value) && operators.includes(lastChar)) return;

    currentInput += value;
    updateDisplay();
}

function updateDisplay() {
    inputField.value = currentInput || '0';
}

/*

document.addEventListener('keydown', (event) => {
    const key = event.key; // Получаем символ нажатой клавиши

    // 1. Цифры и операторы (совпадают с текстом на кнопках)
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '/', '*', '(', ')'];
    
    // 2. Специальные клавиши
    if (validKeys.includes(key)) {
        handleInput(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Чтобы не скроллило страницу
        handleInput('=');
    } else if (key === 'Backspace') {
        handleInput('DEL');
    } else if (key === 'Escape') {
        handleInput('C');
    } else if (key === '*') {
        handleInput('x'); // Если на кнопке умножения у вас 'x', а не '*'
    }
}); 
*/


/* --------------------------------------------------------------------
-------------------------CALCULATE LOGIC----------------------------==*/
function tokenize(expression) {
    const tokens = [];
    let num = "";

    for (let char of expression) {
        if (/\d/.test(char)) {
            num += char; 
        }
        else {
            if (num !== "") {
                tokens.push(num);
                num = "";
            }
            if (char !== " ") {
                tokens.push(char);
            }
        }
    } 
    if(num != "") tokens.push(num);
    return tokens;
}

// console.log(tokenize("as234a"));

function toRPN(tokens) {
    const output = [];
    const stack = [];

    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    };

    for (let token of tokens) {
        // 1. Перевіряємо, чи це число (скидаємо зайві пробіли)
        if (!isNaN(parseFloat(token)) && isFinite(token)) {
            output.push(token);
        }

        else if (token === "(") {
            stack.push(token);
        }

        else if (token === ")") {
            // Виштовхуємо все до відкриваючої дужки
            while (stack.length && stack.at(-1) !== "(") {
                output.push(stack.pop());
            }
            stack.pop(); // Видаляємо саму "("
        }

        else if (token in precedence) {
            // Важливо: перевіряємо, щоб на верхівці стеку не було дужки
            while (
                stack.length &&
                stack.at(-1) !== "(" &&
                precedence[stack.at(-1)] >= precedence[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length) {
        output.push(stack.pop());
    }

    return output;
}

function evalRPN(tokens) {
    const stack = [];

    for (let token of tokens) {
        if(!isNaN(token)) {
            stack.push(Number(token));
        }
        else {
            const b = stack.pop();
            const a = stack.pop();
            
            switch(token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break;
            }
        }
    }
    return stack.pop();
}

function calculate(expr) {
    const tokens = tokenize(expr);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
}

