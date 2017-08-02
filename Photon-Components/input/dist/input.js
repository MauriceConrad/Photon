(function() {
  window.addEventListener("mousedown", function(event) {
    // Check wether the target element is contained within an stepper element
    var isStepper = hasParentSelector(event.target, ".stepper button");
    if (isStepper) {
      // Select target button
      var btn = isStepper[isStepper.length - 1];
      // Select stepper element
      var stepper = btn.parentNode;
      // Get index pos of button in relation to its parent stepper
      var btnPos = (function() {
        var btns = stepper.getElementsByTagName("button");
        for (var i = 0; i < btns.length; i++) {
          if (btns[i] === btn) return i;
        }
      })();
      // Get target input field by data-input attribute of stepper element
      var inputSelector = stepper.getAttribute("data-input");
      var targetInput = document.querySelector(inputSelector);
      if (!targetInput) {
        return console.error("Invalid query selector in 'data-input' attribute '" + inputSelector + "'", stepper);
      }

      addValue(targetInput, btnPos);

      // Clock to fire event when mouse is pressed
      stepper.clockTimer = setTimeout(function() {
        stepper.fireClock = setInterval(function() {
          addValue(targetInput, btnPos);
        }, 80);
      }, 500);

      function addValue(input, pos) {
        // Get step size
        var step = parseFloat(input.step) || 1;
        // Get min value
        var min = parseFloat(input.min) || -Infinity;
        // Get max value
        var max = parseFloat(input.max) || Infinity;
        // Set btn actions
        var actions = [1 * step, -1 * step];
        // Set new value of input with btnActions and buttons's index
        var value = (parseFloat(input.value) || 0) + actions[pos];
        value = Math.round(value * 1000000) / 1000000;
        input.value = value <= max ? (value >= min ? value: min) : max;
      }

    }
  });
  window.addEventListener("mouseup", function(event) {
    var steppers = document.getElementsByClassName("stepper");
    // Loop trough all steppers to stop their clocks
    for (var i = 0; i < steppers.length; i++) {
      // Stop the fire clock
      clearInterval(steppers[i].clockTimer);
      clearInterval(steppers[i].fireClock);
    }
  });


  var valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

  //delete HTMLInputElement.prototype.value;

  Object.defineProperty(HTMLInputElement.prototype, "value", {
    get() {
      var suffix = this.getAttribute("data-suffix") || "";
      var value = valueDescriptor.get.apply(this);
      // If the type is "number", it will be replaced with "text" to allow normal chars like a-z. But it adds 'type-rule' for identifing it as an number field (only such fields will use the replace function that removes all chars except 0-9, '.' and '-')
      if (this.type === "number" && suffix) {
        this.type = "text";
        this.setAttribute("data-type-rule", "suffix");
      }
      // Replace all chars except 0-9, '.', '-'
      if (this.getAttribute("data-type-rule") === "suffix") {
        value = value.replace(/[^[0-9]\.\-]/g, "");
        return parseFloat(value) ? parseFloat(value) : value;
      }
      return value;
    },
    set(value) {
      var suffix = this.getAttribute("data-suffix") || "";
      // If the type is "number", it will be replaced with "text" to allow normal chars like a-z. But it adds 'type-rule' for identifing it as an number field (only such fields will use the replace function that removes all chars except 0-9, '.' and '-')
      if (this.type === "number" && suffix) {
        this.type = "text";
        this.setAttribute("data-type-rule", "suffix");
      }
      // Matches all input fields that have lost their 'number' type because of avoid the limitation 'number-chars-only'
      if (this.getAttribute("data-type-rule") === "suffix") {
        value = value + suffix;
      }
      valueDescriptor.set.apply(this, [value]);
      return true;
    }
  });

  window.addEventListener("change", function(event) {
    var suffix = event.target.getAttribute("data-suffix") || "";
    if (suffix) {
      event.target.value = event.target.value;
    }
  });

  window.addEventListener("load", function(event) {
    var numberSuffixInputs = document.querySelectorAll("input[data-suffix]");
    for (var i = 0; i < numberSuffixInputs.length; i++) {
      numberSuffixInputs[i].value = numberSuffixInputs[i].value;
    }
  });

  function hasParentSelector(e, selector) {
    var children = [];
    while ("matches" in e && !e.matches(selector)) {
      children.push(e);
      e = e.parentNode;
    }
    children.push(e);
    return ("matches" in e && e.matches(selector)) ? children : false;
  }
})();
