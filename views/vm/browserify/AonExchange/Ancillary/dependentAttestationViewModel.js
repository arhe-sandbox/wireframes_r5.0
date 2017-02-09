(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.DependentAttestationViewModel = function DependentAttestationViewModel() {
        if (!(this instanceof DependentAttestationViewModel)) {
            return new DependentAttestationViewModel();
        }

        var self = this;
        self.header_lbl = ko.observable('');
        self.content_html = ko.observable('');
        self.noButton_lbl = ko.observable('');
        self.yesButton_lbl = ko.observable('');

        self.hasBeenLoaded = false;

        DependentAttestationViewModel.prototype.loadFromJSON = function loadFromJSON(dependentAttestation) {
            var protoself = this;

            protoself.header_lbl(dependentAttestation.Header_Lbl);

            if (location.href.indexOf("search-dental-results") > -1) {
                protoself.content_html(dependentAttestation.GenericContent_Html);
            }
            else {
                protoself.content_html(dependentAttestation.Content_Html);
            }
            
            protoself.noButton_lbl(dependentAttestation.NoButton_lbl);
            protoself.yesButton_lbl(dependentAttestation.YesButton_lbl);

            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));