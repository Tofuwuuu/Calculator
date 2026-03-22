(function () {
  const displayEl = document.getElementById("display");
  const displayAnsEl = document.getElementById("display-ans");
  const keypad = document.querySelector(".keypad");

  let firstOperand = "0";
  let operator = null;
  let secondOperand = "";
  let errorState = false;
  let justEvaluated = false;
  let lastAns = 0;

  function opSymbol(op) {
    switch (op) {
      case "add":
        return "+";
      case "subtract":
        return "−";
      case "multiply":
        return "×";
      case "divide":
        return "÷";
      default:
        return "";
    }
  }

  function parseOperand(s) {
    if (s === "" || s === ".") return 0;
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  function formatResult(n) {
    if (!Number.isFinite(n)) return "Error";
    let s = parseFloat(n.toPrecision(12)).toString();
    if (s === "-0") s = "0";
    return s;
  }

  function buildMainDisplay() {
    if (errorState) return "Error";
    if (operator === null) return firstOperand;
    const sym = opSymbol(operator);
    if (secondOperand === "") return `${firstOperand} ${sym}`;
    return `${firstOperand} ${sym} ${secondOperand}`;
  }

  function updateDisplay() {
    displayEl.textContent = buildMainDisplay();
    displayAnsEl.textContent = `Ans = ${formatResult(lastAns)}`;
  }

  function clear() {
    firstOperand = "0";
    operator = null;
    secondOperand = "";
    errorState = false;
    justEvaluated = false;
    lastAns = 0;
    updateDisplay();
  }

  function setError() {
    errorState = true;
    firstOperand = "0";
    operator = null;
    secondOperand = "";
    justEvaluated = false;
    displayEl.textContent = "Error";
    displayAnsEl.textContent = `Ans = ${formatResult(lastAns)}`;
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

  function appendDigit(target, d) {
    if (target === "first") {
      if (justEvaluated) {
        firstOperand = d;
        justEvaluated = false;
        return;
      }
      if (firstOperand === "0" && d !== "0") {
        firstOperand = d;
      } else if (firstOperand === "0" && d === "0") {
        return;
      } else {
        firstOperand += d;
      }
    } else {
      if (secondOperand === "0" && d !== "0") {
        secondOperand = d;
      } else if (secondOperand === "0" && d === "0") {
        return;
      } else if (secondOperand === "") {
        secondOperand = d;
      } else {
        secondOperand += d;
      }
    }
  }

  function inputDigit(d) {
    if (errorState) {
      clear();
    }
    if (operator === null) {
      appendDigit("first", d);
    } else {
      appendDigit("second", d);
    }
    updateDisplay();
  }

  function appendDecimal(target) {
    if (target === "first") {
      if (justEvaluated) {
        firstOperand = "0.";
        justEvaluated = false;
        return;
      }
      if (!firstOperand.includes(".")) {
        firstOperand += ".";
      }
    } else {
      if (secondOperand === "") {
        secondOperand = "0.";
      } else if (!secondOperand.includes(".")) {
        secondOperand += ".";
      }
    }
  }

  function inputDecimal() {
    if (errorState) {
      clear();
    }
    if (operator === null) {
      appendDecimal("first");
    } else {
      appendDecimal("second");
    }
    updateDisplay();
  }

  function inputOperator(op) {
    if (errorState) return;
    if (justEvaluated) {
      justEvaluated = false;
    }
    if (operator !== null && secondOperand !== "") {
      const result = applyOp(
        parseOperand(firstOperand),
        parseOperand(secondOperand),
        operator
      );
      if (result === null) {
        setError();
        return;
      }
      firstOperand = formatResult(result);
      secondOperand = "";
    } else if (operator !== null && secondOperand === "") {
      /* replace operator only */
    } else {
      /* first operator after a number */
    }
    operator = op;
    updateDisplay();
  }

  function equals() {
    if (errorState) return;
    if (operator === null) return;
    const rightStr = secondOperand === "" ? firstOperand : secondOperand;
    const result = applyOp(
      parseOperand(firstOperand),
      parseOperand(rightStr),
      operator
    );
    if (result === null) {
      setError();
      return;
    }
    lastAns = result;
    firstOperand = formatResult(result);
    operator = null;
    secondOperand = "";
    justEvaluated = true;
    updateDisplay();
  }

  function backspace() {
    if (errorState) {
      clear();
      return;
    }
    if (justEvaluated) {
      if (firstOperand.length <= 1) {
        firstOperand = "0";
      } else {
        firstOperand = firstOperand.slice(0, -1);
      }
      updateDisplay();
      return;
    }
    if (operator !== null && secondOperand !== "") {
      secondOperand = secondOperand.slice(0, -1);
    } else if (operator !== null && secondOperand === "") {
      operator = null;
    } else {
      if (firstOperand.length <= 1) {
        firstOperand = "0";
      } else {
        firstOperand = firstOperand.slice(0, -1);
      }
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
