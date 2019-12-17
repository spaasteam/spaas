const componentGenerator = require('./plop-templates/component/prompt');
const viewGenerator = require('./plop-templates/view/prompt');
const {setRouteAction} = require('./plop-templates/utils');

module.exports = plop => {
  // 增加一种 action
  plop.setActionType('setRouteInfo', setRouteAction);

  plop.setGenerator('view', viewGenerator);
  plop.setGenerator('component', componentGenerator);
};
