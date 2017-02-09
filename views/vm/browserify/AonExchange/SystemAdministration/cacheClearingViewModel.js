(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CacheClearingViewModel = function CacheClearingViewModel() {
        if (!(this instanceof CacheClearingViewModel)) {
            return new CacheClearingViewModel();
        }
        var self = this;
        self.CacheGroupHeaderHtml = ko.observable('');
        self.ClearGroupButtonHtml = ko.observable('');
        self.ClearAllButtonHtml = ko.observable('');
        self.CacheGroups = ko.observableArray([]);

        CacheClearingViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.CacheGroupHeaderHtml(viewModel.CacheGroupHeaderHtml);
            protoSelf.ClearGroupButtonHtml(viewModel.ClearGroupButtonHtml);
            protoSelf.ClearAllButtonHtml(viewModel.ClearAllButtonHtml);
            protoSelf.CacheGroups(viewModel.CacheGroups);
            return protoSelf;
        };
    };

} (EXCHANGE));