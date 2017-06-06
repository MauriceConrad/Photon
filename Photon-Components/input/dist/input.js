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
