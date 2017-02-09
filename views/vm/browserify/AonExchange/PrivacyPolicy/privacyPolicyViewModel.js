(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.PrivacyPolicyPopupViewModel = function PrivacyPolicyPopupViewModel() {
        if (!(this instanceof PrivacyPolicyPopupViewModel)) {
            return new PrivacyPolicyPopupViewModel();
        }
        var self = this;
        self.header_lbl = ko.observable('');
        self.content_html = ko.observable('');
        self.okButton_lbl = ko.observable('');
        self.hasBeenLoaded = false;

        PrivacyPolicyPopupViewModel.prototype.loadFromJSON = function loadFromJSON(privacyPolicy) {
            var protoself = this;

            protoself.header_lbl(privacyPolicy.Header_Lbl);
            protoself.content_html(privacyPolicy.Content_Html);
            protoself.okButton_lbl(privacyPolicy.OkButton_Lbl);

            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));