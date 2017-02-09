(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.InvalidNdcViewModel = function InvalidNdcViewModel() {
        if (!(this instanceof InvalidNdcViewModel)) {
            return new InvalidNdcViewModel();
        }
        var self = this;

        self.shouldOpenInvalidNdcLightbox = ko.observable(true);
        self.NoNdcAvailableText_Lbl = ko.observable("");
        self.UpdateMedicineCabinet_Btn = ko.observable("");
        self.HeaderText_Lbl = ko.observable("");
        self.OkButtonText_Lbl = ko.observable("");
        self.CancelBackButtonText_Lbl = ko.observable("");
        self.DrugListHeader_Lbl = ko.observable("");
        self.BottomMiddleInstructions_Lbl = ko.observable("");
        self.RemovedUserDrugs = ko.observable([]);

        InvalidNdcViewModel.prototype.loadFromJSON = function loadFromJSON(select) {
            var protoSelf = this;

            protoSelf.NoNdcAvailableText_Lbl(select.NoNdcAvailableText_Lbl);
            protoSelf.UpdateMedicineCabinet_Btn(select.UpdateMedicineCabinet_Btn);
            protoSelf.HeaderText_Lbl(select.HeaderText_Lbl);
            protoSelf.OkButtonText_Lbl(select.OkButtonText_Lbl);
            protoSelf.CancelBackButtonText_Lbl(select.CancelBackButtonText_Lbl);
            protoSelf.DrugListHeader_Lbl(select.DrugListHeader_Lbl);
            protoSelf.BottomMiddleInstructions_Lbl(select.BottomMiddleInstructions_Lbl);
            protoSelf.RemovedUserDrugs(select.RemovedUserDrugs);
            return protoSelf;
        };
    };

} (EXCHANGE, this));