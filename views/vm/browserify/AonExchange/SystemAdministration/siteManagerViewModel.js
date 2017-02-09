(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.SiteManagerViewModel = function SiteManagerViewModel() {
        if (!(this instanceof SiteManagerViewModel)) {
            return new SiteManagerViewModel();
        }
        var self = this;

        self.ActionResult = ko.observable('');  

        SiteManagerViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.ActionResult(viewModel.ActionResult);
                           
            return protoSelf;
        };
    };

} (EXCHANGE));