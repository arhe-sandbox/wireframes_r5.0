(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.FaqPopupViewModel = function FaqPopupViewModel() {
        if (!(this instanceof FaqPopupViewModel)) {
            return new FaqPopupViewModel();
        }
        var self = this;

        self.header_lbl = ko.observable('');
        self.desc_lbl = ko.observable('');
        self.okButton_lbl = ko.observable('');
        self.hasBeenLoaded = false;

        FaqPopupViewModel.prototype.loadFromJSON = function loadFromJSON(faq) {
            var protoSelf = this;
            
            protoSelf.okButton_lbl(faq.OkButton_Lbl);
            protoSelf.hasBeenLoaded = true;

            return protoSelf;
        };

        FaqPopupViewModel.prototype.setHeader = function setHeader(header) {
            var protoSelf = this;

            protoSelf.header_lbl(header);

            return protoSelf;
        };

        FaqPopupViewModel.prototype.setDesc = function setDesc(desc) {
            var protoSelf = this;

            protoSelf.desc_lbl(desc);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE));