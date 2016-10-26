'use strict';

var _path = require('path');

module.exports = function (content) {
  this.cacheable();

  var route = getRoute(this);

  return content + ('\n    if (module.hot) {\n      module.hot.accept()\n      if (module.hot.status() !== \'idle\') {\n        var Component = module.exports.default || module.exports\n        next.router.update(\'' + route + '\', Component)\n      }\n    }\n  ');
};

function getRoute(loaderContext) {
  var pagesDir = (0, _path.resolve)(loaderContext.options.context, 'pages');
  var path = loaderContext.resourcePath;
  return '/' + (0, _path.relative)(pagesDir, path).replace(/((^|\/)index)?\.js$/, '');
}