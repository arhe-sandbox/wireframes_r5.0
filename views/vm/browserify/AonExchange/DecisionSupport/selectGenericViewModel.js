(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SelectGenericViewModel = function SelectGenericViewModel() {
        if (!(this instanceof SelectGenericViewModel)) {
            return new SelectGenericViewModel();
        }
        var self = this;

        self.brand_short = ko.observable("");
        self.generic_short = ko.observable("");
        self.title = ko.observable("");

        self.brandFull_lbl = ko.observable("");
        self.genericFull_lbl = ko.observable("");

        self.drugList = ko.observableArray([]);
        self.genericStart = ko.observable(false);

        self.formattedTitle = ko.computed({
            read: function () {
                var type = self.genericStart() ? self.brand_short() : self.generic_short();
                return self.title().format(type);
            },
            owner: this,
            deferEvaluation: true
        });

        self.brandOrGeneric = function (isGeneric) {
            return isGeneric ? self.genericFull_lbl() : self.brandFull_lbl();
        };

        SelectGenericViewModel.prototype.loadFromJSON = function loadFromJSON(select) {
            var protoSelf = this;
            
            protoSelf.brand_short(select.Brand_Short);
            protoSelf.generic_short(select.Generic_Short);
            protoSelf.title(select.Title);
            protoSelf.brandFull_lbl(select.BrandFull_Lbl);
            protoSelf.genericFull_lbl(select.GenericFull_Lbl);
            
            return protoSelf;
        };
    };

} (EXCHANGE, this));