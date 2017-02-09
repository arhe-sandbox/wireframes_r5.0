(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.myDoctorsViewModel = function myDoctorsViewModel() {
        if (!(this instanceof myDoctorsViewModel)) {
            return new myDoctorsViewModel();
        }
        var self = this;
        self.miles = ko.observable(10);
        self.doctors = ko.observableArray([]);
        self.providers = ko.observableArray([]);

        myDoctorsViewModel.prototype.loadFromJSON = function loadFromJSON(data) {
            var protoself = this;

            protoself.providers = data.providerDetailArray;

            return protoself;
        };

    };



} (EXCHANGE));
