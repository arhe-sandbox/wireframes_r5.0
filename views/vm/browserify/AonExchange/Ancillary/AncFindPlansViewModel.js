(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.AncFindPlansViewModel = function AncFindPlansViewModel() {
        if (!(this instanceof AncFindPlansViewModel)) {
            return new AncFindPlansViewModel();
        }
        var self = this;
        self.header_lbl = ko.observable('');
        self.content_Html = ko.observable('');
        self.okButton_Lbl = ko.observable('');
        self.hasBeenLoaded = false;

        AncFindPlansViewModel.prototype.loadFromJSON = function loadFromJSON(ancfindplans) {
            var protoself = this;

            protoself.header_lbl(ancfindplans.Header_lbl);
            protoself.content_Html(ancfindplans.Content_Html);
            //protoself.okButton_Lbl(ancfindplans.OkButton_Lbl);

            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));