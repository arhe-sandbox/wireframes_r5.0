(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SelectCountyPopupViewModel = function SelectCountyPopupViewModel() {
        if (!(this instanceof SelectCountyPopupViewModel)) {
            return new SelectCountyPopupViewModel();
        }
        var self = this;

        self.getHelp_lbl = ko.observable('');
        self.phone_lbl = ko.observable('');
        self.hours_lbl = ko.observable('');
        self.whatCounty_lbl = ko.observable('');
        self.instructions_lbl = ko.observable('');
        self.countyOption_lbls = ko.observableArray([]);
        self.countyOption_radio = ko.observable('');
        self.goBackBtn_lbl = ko.observable('');
        self.continueBtn_lbl = ko.observable('');

        SelectCountyPopupViewModel.prototype.loadFromJSON = function loadFromJSON(selectCounty) {
            self.getHelp_lbl(selectCounty.GetHelp_Lbl);
            self.phone_lbl(selectCounty.Phone_Lbl);
            self.hours_lbl(selectCounty.Hours_Lbl);
            self.whatCounty_lbl(selectCounty.WhatCounty_Lbl);
            self.instructions_lbl(selectCounty.Instructions_Lbl);
            self.countyOption_lbls(selectCounty.CountyOption_Lbls);
            self.countyOption_radio(selectCounty.CountyOption_Radio);
            self.goBackBtn_lbl(selectCounty.GoBackBtn_Lbl);
            self.continueBtn_lbl(selectCounty.ContinueBtn_Lbl);

            return self;
        };

        return self;
    };

} (EXCHANGE, this));