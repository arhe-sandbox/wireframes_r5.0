  EXCHANGE.namespace('EXCHANGE.viewModels');

EXCHANGE.viewModels.LoginViewModel = EXCHANGE.models.LoginViewModel();

 require('./AonExchange/Shared/sharedPopupHeaderViewModel')
EXCHANGE.viewModels.SharedPopupHeaderViewModel = EXCHANGE.models.SharedPopupHeaderViewModel();
var HeaderViewModel = require('./data/HeaderViewModel.json');
EXCHANGE.viewModels.SharedPopupHeaderViewModel.loadFromJSON(HeaderViewModel);
console.log(HeaderViewModel);