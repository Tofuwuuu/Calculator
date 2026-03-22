(function () {
  const displayEl = document.getElementById("display");
  const keypad = document.querySelector(".keypad");

  let displayValue = "0";
  let storedValue = null;
  let pendingOperator = null;
  let waitingForOperand = false;
  let errorState = false;

  function updateDisplay() {
    displayEl.textContent = displayValue;
  }

  function clear() {
    displayValue = "0";
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = false;
    errorState = false;
    updateDisplay();
  }

  function setError() {
    displayValue = "Error";
    errorState = true;
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    updateDisplay();
  }

  function formatResult(n) {
    if (!Number.isFinite(n)) return "Error";
    let s = parseFloat(n.toPrecision(12)).toString();
    if (s === "-0") s = "0";
    return s;
  }

  function getDisplayNumber() {
    if (displayValue === "Error") return NaN;
    const n = parseFloat(displayValue);
    return Number.isFinite(n) ? n : 0;
  }

  function applyOp(a, b, op) {
    switch (op) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        return b === 0 ? null : a / b;
      default:
        return b;
    }
  }

  function inputDigit(d) {
    if (errorState) {
      clear();
    }
    if (waitingForOperand) {
      displayValue = d;
      waitingForOperand = false;
    } else {
      if (displayValue === "0" && d !== "0") {
        displayValue = d;
      } else if (displayValue === "0" && d === "0") {
        return;
      } else if (displayValue === "-0") {
        displayValue = "-" + d;
      } else {
        displayValue += d;
      }
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (errorState) {
      clear();
    }
    if (waitingForOperand) {
      displayValue = "0.";
      waitingForOperand = false;
    } else if (!displayValue.includes(".")) {
      displayValue += ".";
    }
    updateDisplay();
  }

  function inputOperator(op) {
    if (errorState) return;
    if (pendingOperator !== null && !waitingForOperand) {
      const result = applyOp(storedValue, getDisplayNumber(), pendingOperator);
      if (result === null) {
        setError();
        return;
      }
      displayValue = formatResult(result);
      storedValue = result;
    } else {
      storedValue = getDisplayNumber();
    }
    pendingOperator = op;
    waitingForOperand = true;
    updateDisplay();
  }

  function equals() {
    if (errorState) return;
    if (pendingOperator === null) return;
    const right = waitingForOperand ? storedValue : getDisplayNumber();
    const result = applyOp(storedValue, right, pendingOperator);
    if (result === null) {
      setError();
      return;
    }
    displayValue = formatResult(result);
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    updateDisplay();
  }

  function backspace() {
    if (errorState) {
      clear();
      return;
    }
    if (waitingForOperand) return;
    if (displayValue.length <= 1) {
      displayValue = "0";
    } else {
      displayValue = displayValue.slice(0, -1);
    }
    updateDisplay();
  }

  keypad.addEventListener("click", function (e) {
    const btn = e.target.closest("button.key");
    if (!btn) return;

    const digit = btn.getAttribute("data-digit");
    if (digit !== null) {
      inputDigit(digit);
      return;
    }

    const op = btn.getAttribute("data-operator");
    if (op !== null) {
      inputOperator(op);
      return;
    }

    const action = btn.getAttribute("data-action");
    if (action === "clear") clear();
    else if (action === "backspace") backspace();
    else if (action === "decimal") inputDecimal();
    else if (action === "equals") equals();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault();
      inputDigit(e.key);
      return;
    }
    if (e.key === ".") {
      e.preventDefault();
      inputDecimal();
      return;
    }
    if (e.key === "+") {
      e.preventDefault();
      inputOperator("add");
      return;
    }
    if (e.key === "=") {
      e.preventDefault();
      equals();
      return;
    }
    if (e.key === "-") {
      e.preventDefault();
      inputOperator("subtract");
      return;
    }
    if (e.key === "*") {
      e.preventDefault();
      inputOperator("multiply");
      return;
    }
    if (e.key === "/") {
      e.preventDefault();
      inputOperator("divide");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      equals();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      clear();
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      backspace();
    }
  });
})();
