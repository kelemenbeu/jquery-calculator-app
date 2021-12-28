var $ = require("jquery");

$(function () {
  const numberButtons = $("#controls .number");
  const operationButtons = $("#controls .operation");
  const equalsButton = $("#controls .equal");
  const deleteButton = $("#controls .delete");
  const resetButton = $("#controls #reset");
  const previousOperandTextElement = $("#display .previous-operand");
  const currentOperandTextElement = $("#display .current-operand");

  class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.reset();
    }

    reset() {
      this.currentOperand = "0";
      this.previousOperand = "";
      this.operation = undefined;
    }

    delete() {
      if (this.currentOperand.length === 1) {
        this.currentOperand = "0";
      } else {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
      }
    }

    appendNumber(number) {
      if (number === "." && this.currentOperand.toString().includes("."))
        return;
      if (this.currentOperand === "0") {
        this.currentOperand = number.toString();
        return;
      }
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
      if (this.currentOperand === "") return;
      if (this.previousOperand !== "") {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = "";
    }

    compute() {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      if (isNaN(prev) || isNaN(current)) return;
      switch (this.operation) {
        case "+":
          computation = prev + current;
          break;
        case "-":
          computation = prev - current;
          break;
        case "*":
          computation = prev * current;
          break;
        case "/":
          computation = prev / current;
          break;
        default:
          return;
      }
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = "";
    }

    getDisplayNumber(number) {
      const stringNumber = number.toString();
      const integerDigits = parseFloat(stringNumber.split(".")[0]);
      const decimalDigits = stringNumber.split(".")[1];
      let integerDisplay;
      if (isNaN(integerDigits)) {
        integerDisplay = "";
      } else {
        integerDisplay = integerDigits.toLocaleString("en", {
          maximumFractionDigits: 0,
        });
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
      } else {
        return integerDisplay;
      }
    }

    updateDisplay() {
      $(this.currentOperandTextElement).text(
        this.getDisplayNumber(this.currentOperand)
      );

      if (this.operation != null) {
        $(this.previousOperandTextElement).text(
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        );
      } else {
        $(this.previousOperandTextElement).text("");
      }
    }
  }

  const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandTextElement
  );

  numberButtons.each(function () {
    $(this).on("click", function () {
      calculator.appendNumber($(this).text());
      calculator.updateDisplay();
    });
  });

  operationButtons.each(function () {
    $(this).on("click", function () {
      calculator.chooseOperation($(this).text());
      calculator.updateDisplay();
    });
  });

  $(equalsButton).on("click", function () {
    calculator.compute();
    calculator.updateDisplay();
  });

  $(resetButton).on("click", () => {
    calculator.reset();
    calculator.updateDisplay();
  });

  $(deleteButton).on("click", () => {
    calculator.delete();
    calculator.updateDisplay();
  });
});
