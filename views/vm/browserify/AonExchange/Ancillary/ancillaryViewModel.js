(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.AncillaryPopupViewModel = function AncillaryPopupViewModel() {
        if (!(this instanceof AncillaryPopupViewModel)) {
            return new AncillaryPopupViewModel();
                }
       
        var self = this;
        self.header_lbl = ko.observable('');
        self.content_html = ko.observable('');
        self.provider_html = ko.observable('');
        self.providerLookupButton_lbl = ko.observable('');
        self.goBackButton_lbl = ko.observable('');
        
        self.hasBeenLoaded = false;

        AncillaryPopupViewModel.prototype.loadFromJSON = function loadFromJSON(ancillary) {
            var protoself = this;

            protoself.header_lbl(ancillary.Header_Lbl);
            protoself.content_html(ancillary.Content_Html);
            protoself.provider_html(ancillary.Provider_Html);
            protoself.providerLookupButton_lbl(ancillary.ProviderLookupButton_Lbl);
            protoself.goBackButton_lbl(ancillary.GoBackButton_Lbl);

            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));