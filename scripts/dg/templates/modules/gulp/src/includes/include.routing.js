example.routing = function() {
  var routes = {};

  routes['example.foo'] = {
    path: '/hello-world',
    defaults: {
      _title: 'Hello World',
      _controller: example.helloWorldController
    }
  };

  return routes;
};
