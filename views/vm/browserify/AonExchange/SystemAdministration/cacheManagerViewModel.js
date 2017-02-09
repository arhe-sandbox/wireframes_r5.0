(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CacheManagerViewModel = function CacheManagerViewModel() {
        if (!(this instanceof CacheManagerViewModel)) {
            return new CacheManagerViewModel();
        }
        var self = this;
        var myArray = [];
        var myFileBackStatus = [];

        self.CacheGroupHeaderHtml = ko.observable('');
        self.ClearGroupButtonHtml = ko.observable('');
        self.ClearAllButtonHtml = ko.observable('');
        self.CacheGroups = ko.observableArray([]);
        self.CacheGroupFileBackStatus = ko.observableArray([]);
        self.CacheKeyResults = ko.observableArray([]);
        self.message = ko.observable();

        CacheManagerViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            $.each(viewModel.CacheKeyResults, function (index, order) {
                myArray.push([index, order]);
            });

            $.each(viewModel.CacheGroupFileBackStatus, function (index, value) {
                myFileBackStatus.push(value ? 'On' : 'Off');
            });

            protoSelf.CacheGroupHeaderHtml(viewModel.CacheGroupHeaderHtml);
            protoSelf.ClearGroupButtonHtml(viewModel.ClearGroupButtonHtml);
            protoSelf.ClearAllButtonHtml(viewModel.ClearAllButtonHtml);
            protoSelf.CacheGroups(viewModel.CacheGroups);
            protoSelf.CacheGroupFileBackStatus(myFileBackStatus);
            protoSelf.CacheKeyResults(myArray);
                        
            return protoSelf;
        };
    };

} (EXCHANGE));