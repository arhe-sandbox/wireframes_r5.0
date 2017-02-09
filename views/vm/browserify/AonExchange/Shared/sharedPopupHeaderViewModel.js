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