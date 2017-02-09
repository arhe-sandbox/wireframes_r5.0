(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.ConfirmStartOverPopupViewModel = function ConfirmStartOverPopupViewModel() {
        if (!(this instanceof ConfirmStartOverPopupViewModel)) {
            return new ConfirmStartOverPopupViewModel();
        }
        var self = this;

        self.header_lbl = ko.observable('');
        self.body_lbl = ko.observable('');
        self.cancelBtn_lbl = ko.observable('');
        self.okBtn_lbl = ko.observable('');
        self.hasBeenLoaded = false;
        self.location = '';

        ConfirmStartOverPopupViewModel.prototype.loadFromJSON = function loadFromJSON(startOver) {
            var protoSelf = this;

            protoSelf.header_lbl(startOver.Header_Lbl);
            protoSelf.body_lbl(startOver.Body_Lbl);
            protoSelf.cancelBtn_lbl(startOver.CancelBtn_Lbl);
            protoSelf.okBtn_lbl(startOver.OkBtn_Lbl);
            protoSelf.hasBeenLoaded = true;

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE));