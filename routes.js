const routes = require("next-routes")(); // returns a function

routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests","/campaigns/requests/index")
  .add("/campaigns/:address/requests/new","/campaigns/requests/new");

module.exports = routes; //exportes helpers so we can automaticly navigate throut the application
