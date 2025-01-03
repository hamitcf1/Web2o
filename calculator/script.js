function addClickAnimation(button) {
    button.classList.add('clicked');
    
    // Add active state color
    if (button.classList.contains('operator')) {
        button.style.backgroundColor = '#ffc168';
    } else if (button.classList.contains('special')) {
        button.style.backgroundColor = '#d4d4d4';
    } else {
        button.style.backgroundColor = '#737373';
    }
    
    setTimeout(() => {
        button.classList.remove('clicked');
        // Reset to original color with transition
        button.style.backgroundColor = '';
    }, 200);
}

class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.charAt(0) === '-' ? 
            this.currentOperand.slice(1) : '-' + this.currentOperand;
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = number.toString();
            this.shouldResetScreen = false;
            return;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentOperandElement = document.querySelector('.current-operand');
        const displayText = this.getDisplayNumber(this.currentOperand);
        
        // Reset classes
        currentOperandElement.classList.remove('long', 'very-long');
        
        // Calculate the appropriate class based on content length
        const textLength = displayText.length;
        const fontSize = window.getComputedStyle(currentOperandElement).fontSize;
        const containerWidth = currentOperandElement.offsetWidth;
        
        // Create a temporary span to measure text width
        const span = document.createElement('span');
        span.style.fontSize = fontSize;
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.textContent = displayText;
        document.body.appendChild(span);
        
        const textWidth = span.offsetWidth;
        document.body.removeChild(span);
        
        // Add appropriate class based on text width
        if (textWidth > containerWidth * 0.8) {
            currentOperandElement.classList.add('long');
        }
        if (textWidth > containerWidth * 0.9) {
            currentOperandElement.classList.add('very-long');
        }
        
        currentOperandElement.textContent = displayText;

        // Update previous operand
        if (this.operation != null) {
            document.querySelector('.previous-operand').textContent =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.querySelector('.previous-operand').textContent = '';
        }
    }
}

const calculator = new Calculator();

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        addClickAnimation(button);
        
        if (button.textContent === 'AC') {
            calculator.clear();
        } else if (button.textContent === '±') {
            calculator.toggleSign();
        } else if (button.textContent === '%') {
            calculator.percentage();
        } else if ('+-−×÷'.includes(button.textContent)) {
            calculator.chooseOperation(button.textContent);
        } else if (button.textContent === '=') {
            calculator.compute();
        } else {
            calculator.appendNumber(button.textContent);
        }
        calculator.updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', e => {
    const key = e.key;
    let button = null;

    // Find the corresponding button for the pressed key
    if (key >= '0' && key <= '9' || key === '.') {
        button = Array.from(document.querySelectorAll('button')).find(b => b.textContent === key);
    } else if (key === 'Enter' || key === '=') {
        button = document.querySelector('button.operator:last-child');
    } else if (key === 'Escape') {
        button = document.querySelector('button.special');
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        const opMap = { '*': '×', '/': '÷', '-': '−' };
        button = Array.from(document.querySelectorAll('button')).find(b => b.textContent === (opMap[key] || key));
    }

    // Add animation if button was found
    if (button) {
        addClickAnimation(button);
    }

    // Original keyboard handling logic
    if (key >= '0' && key <= '9' || key === '.') calculator.appendNumber(key);
    if (key === '=' || key === 'Enter') calculator.compute();
    if (key === 'Backspace') calculator.delete();
    if (key === 'Escape') calculator.clear();
    if (key === '%') calculator.percentage();
    if (['+', '-', '*', '/'].includes(key)) {
        const opMap = { '*': '×', '/': '÷', '-': '−' };
        calculator.chooseOperation(opMap[key] || key);
    }
    calculator.updateDisplay();
}); 