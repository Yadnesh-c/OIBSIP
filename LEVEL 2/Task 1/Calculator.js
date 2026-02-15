const display = document.getElementById('display');


function appendToDisplay(input) {
    if (display.innerText === '0' && input !== '.') {
        display.innerText = input;
    } else {
        display.innerText += input;
    }
}

function clearDisplay() {
    display.innerText = '0';
}

function deleteLast() {
    if (display.innerText.length > 1) {
        display.innerText = display.innerText.slice(0, -1);
    } else {
        display.innerText = '0';
    }
}

function calculateResult() {
    try {
        let expression = display.innerText.replace('x', '*'); 
        display.innerText = eval(expression);
    } catch (error) {
        display.innerText = 'Error';
    }
}


document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if ((key >= '0' && key <= '9') || key === '.') {
        appendToDisplay(key);
        visualPress(key);
    } 
    else if (['+', '-', '*', '/', '%'].includes(key)) {
        appendToDisplay(key);
        visualPress(key);
    } 
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
        visualPress('Enter');
    } 
    else if (key === 'Backspace') {
        deleteLast();
        visualPress('Backspace');
    } 
    else if (key === 'Escape') {
        clearDisplay();
        visualPress('Escape');
    }
});

function visualPress(key) {
    const button = document.querySelector(`button[data-key="${key}"]`);
    
    if (button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 100);
    }
}