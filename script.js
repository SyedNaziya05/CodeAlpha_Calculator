let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');

// Update display
function updateDisplay() {
  currentDisplay.textContent = currentInput;
  previousDisplay.textContent = operator ? `${previousInput} ${operator}` : '';
}

// Append number
function appendNumber(num) {
  if (currentInput === '0' || shouldResetScreen) {
    currentInput = num;
    shouldResetScreen = false;
  } else {
    if (currentInput.length >= 12) return; // limit digits
    currentInput += num;
  }
  updateDisplay();
}

// Append decimal
function appendDecimal() {
  if (shouldResetScreen) {
    currentInput = '0.';
    shouldResetScreen = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

// Set operator
function setOperator(op) {
  if (operator && !shouldResetScreen) calculate();
  previousInput = currentInput;
  operator = op;
  shouldResetScreen = true;
  updateDisplay();
}

// Calculate
function calculate() {
  if (!operator || shouldResetScreen) return;
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
      if (curr === 0) {
        currentInput = 'Error';
        operator = null;
        updateDisplay();
        return;
      }
      result = prev / curr;
      break;
  }

  previousDisplay.textContent = `${previousInput} ${operator} ${currentInput} =`;
  currentInput = parseFloat(result.toFixed(10)).toString();
  operator = null;
  shouldResetScreen = true;
  currentDisplay.textContent = currentInput;
}

// Clear
function clearDisplay() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

// Delete last character
function deleteLast() {
  if (shouldResetScreen) return;
  currentInput = currentInput.slice(0, -1) || '0';
  updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (e.key === '+') setOperator('+');
  else if (e.key === '-') setOperator('-');
  else if (e.key === '*') setOperator('*');
  else if (e.key === '/') { e.preventDefault(); setOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearDisplay();
});