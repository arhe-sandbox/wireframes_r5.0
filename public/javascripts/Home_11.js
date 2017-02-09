(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');
    ns.SharedPopupHeaderViewModel = function SharedPopupHeaderViewModel() {
        if (!(this instanceof SharedPopupHeaderViewModel)) {
            return new SharedPopupHeaderViewModel();
        }
        var self = this;
        
        self.getHelp_lbl = ko.observable('');
        self.phone_lbl = ko.observable('');
        self.phoneTTY_lbl = ko.observable('');
        self.hours_lbl = ko.observable('');

        SharedPopupHeaderViewModel.prototype.loadFromJSON = function loadFromJSON(helpObj) {
            var protoSelf = this;

            protoSelf.getHelp_lbl(helpObj.GetHelp_Lbl);
            protoSelf.phone_lbl(helpObj.Phone_Lbl);
            protoSelf.phoneTTY_lbl(helpObj.PhoneTTY_Lbl);
            protoSelf.hours_lbl(helpObj.Hours_Lbl);

            return protoSelf;
        };

        return self;
    };

})(EXCHANGE, this);
},{}],2:[function(require,module,exports){
module.exports={"GetHelp_Lbl":"Get Help","Phone_Lbl":"1-800-350-1470","PhoneTTY_Lbl":"(TTY 711)","Hours_Lbl":"Mon-Fri, 7am-10pm Central Time"}
},{}],3:[function(require,module,exports){
  EXCHANGE.namespace('EXCHANGE.viewModels');

EXCHANGE.viewModels.LoginViewModel = EXCHANGE.models.LoginViewModel();

 require('./AonExchange/Shared/sharedPopupHeaderViewModel')
EXCHANGE.viewModels.SharedPopupHeaderViewModel = EXCHANGE.models.SharedPopupHeaderViewModel();
var HeaderViewModel = require('./data/HeaderViewModel.json');
EXCHANGE.viewModels.SharedPopupHeaderViewModel.loadFromJSON(HeaderViewModel);
console.log(HeaderViewModel);
},{"./AonExchange/Shared/sharedPopupHeaderViewModel":1,"./data/HeaderViewModel.json":2}]},{},[3])