(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.DependentSpouseViewModel = function DependentSpouseViewModel() {
        if (!(this instanceof DependentSpouseViewModel)) {
            return new DependentSpouseViewModel();
        }

        var self = this;
        self.header_lbl = ko.observable('');
        self.content_html = ko.observable('');
        self.goBackButton_lbl = ko.observable('');
       

        self.hasBeenLoaded = false;

        DependentSpouseViewModel.prototype.loadFromJSON = function loadFromJSON(dependentSpouse) {
            var protoself = this;

            protoself.header_lbl(dependentSpouse.Header_Lbl);
            protoself.content_html(dependentSpouse.Content_Html);
            protoself.goBackButton_lbl(dependentSpouse.GoBackButton_lbl);
          

            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));