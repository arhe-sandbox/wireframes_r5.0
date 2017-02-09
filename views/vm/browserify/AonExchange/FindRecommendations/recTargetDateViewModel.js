(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.recTargetDateViewModel = function recTargetDateViewModel() {
        if (!(this instanceof recTargetDateViewModel)) {
            return new recTargetDateViewModel();
        }
        var self = this;


        
        self.countyName = ko.observable('');

       // self.coverageBegins_lbl = ko.observable('When should coverage begin?');
        self.coverageBegins_options = ko.observableArray([]);
        self.coverageBegins_tb = ko.observable('');

        recTargetDateViewModel.prototype.clearInlineErrors = function clearInlineErrors() {
            self.inlineErrorsExist(false);
            self.inlineErrors([]);
        };

        recTargetDateViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr) {
            self.inlineErrorsExist(true);
            var errorList = self.inlineErrors();
            errorList.push(inlineErrorStr);
            self.inlineErrors(errorList);
            return self;
        };

        recTargetDateViewModel.prototype.loadFromJSON = function loadFromJSON(findPlans) {
            var protoself = this;


            
            protoself.countyName(findPlans.CountyName);

         //   protoself.coverageBegins_lbl(findPlans.CoverageBegins_Lbl);
            protoself.coverageBegins_options(findPlans.CoverageBegins_Options);
            protoself.coverageBegins_tb(findPlans.CoverageBegins_Tb);


            return protoself;
        };

        recTargetDateViewModel.prototype.toJS = function toJS() {
            var protoSelf = this;
            var toReturn = {
                UserZip: protoSelf.userZip_tb(),
                CoverageBegins: protoSelf.coverageBegins_tb(),

            };

            return toReturn;
        };
    };

} (EXCHANGE, this));