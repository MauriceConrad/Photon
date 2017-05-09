dropDownMenu = (function() {
  // Anonymous function to avoid global variables but keep performance and don't require modules in the exported global function
  const {remote} = require('electron');
  const Menu = remote.Menu;
  const MenuItem = remote.MenuItem;
  // Gloabl method
  function dropDownMenu(target, template) {
    // Create menu from options template
    var menu = Menu.buildFromTemplate(template);
    // Get bounding of target
    var targetBounds = target.getBoundingClientRect();
    // Popup menu and set it#s position
    var res = menu.popup({
      x: targetBounds.left,
      y: targetBounds.top + targetBounds.height + 6,
      async: true
    });
    return menu;
  }
  // Return 'dropDownMenu' method into the global context
  return dropDownMenu;
})();
