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
        // Warning: eval() is used here for simplicity in this demo.
        // For a production app, use a safer math parser.
        display.innerText = eval(display.innerText);
    } catch (error) {
        display.innerText = 'Error';
    }
}