(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.BottomBarViewModel = function BottomBarViewModel() {
        if (!(this instanceof BottomBarViewModel)) {
            return new BottomBarViewModel();
        }
        var self = this;

        self.goBackBtn_lbl = ko.observable('Go Back');
        self.bottomText_lbl = ko.observable('Review and add compare plans above.<br/>Add plans to your cart to check out.');
        self.checkout_lbl = ko.observable('Checkout');



        BottomBarViewModel.prototype.loadFromJSON = function loadFromJSON(bar) {
            var protoSelf = this;
            
            protoSelf.goBackBtn_lbl(bar.GoBackBtn_Lbl);
            protoSelf.bottomText_lbl(bar.BottomText_Lbl);
            protoSelf.checkout_lbl(bar.Checkout_Lbl);
            
            return protoSelf;
        };

        return self;
    };

} (EXCHANGE, this));