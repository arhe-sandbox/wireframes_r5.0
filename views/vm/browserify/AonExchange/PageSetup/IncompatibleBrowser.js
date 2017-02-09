(function (app, global) {

    //"use strict";
    var ns = app.namespace('EXCHANGE.viewModels');
    EXCHANGE.namespace('EXCHANGE.models');

    ns.IncompatibleBrowserViewModel = function IncompatibleBrowserViewModel() {
        if (!(this instanceof IncompatibleBrowserViewModel)) {
            return new IncompatibleBrowserViewModel();
        }

        var self = this;
        self.header_lbl = ko.observable('');
        self.content_html = ko.observable('');
        self.continue_lbl = ko.observable('');


        self.hasBeenLoaded = false;

        IncompatibleBrowserViewModel.prototype.loadFromJSON = function loadFromJSON(incompatibleBrowser) {
            var protoself = this;

            protoself.header_lbl(incompatibleBrowser.Header_Lbl);
            protoself.content_html(incompatibleBrowser.Content_Html);
            protoself.continue_lbl(incompatibleBrowser.ContinueButton_Lbl);
            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));