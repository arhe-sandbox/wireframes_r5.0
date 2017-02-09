(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.ESRDConfirmationViewModel = function ESRDConfirmationViewModel() {
        if (!(this instanceof ESRDConfirmationViewModel)) {
            return new ESRDConfirmationViewModel();
        }
        var self = this;
        self.PlanName_Lbl = ko.observable("");
        self.ESRDSituation_Lbl = ko.observable("");
        self.ESRDSituation1_Lbl = ko.observable("");
        self.EGHPSituation1_Lbl = ko.observable("");
        self.ESRDSituation2_Lbl = ko.observable("");
        self.ESRDSituation3_Lbl = ko.observable("");
        self.ESRDQuestion_Lbl = ko.observable("");
        self.EGHPQuestion_Lbl = ko.observable("");
        self.Header = ko.observable("");
        self.BackBtn = ko.observable("");
        self.ContinueBtn = ko.observable("");
        self.MoreHelpBtn = ko.observable("");
        self.HomeBtn = ko.observable("");
        self.IsEGHP = ko.observable("");
        self.Help_Lbl = ko.observable("");
        self.EGHPHelp_Lbl = ko.observable("");
        self.ESRD_Id = ko.observable("");

        self.HasESRDSituation_radio = ko.observable("");
        self.Plan = ko.observable([]);

        ESRDConfirmationViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.PlanName_Lbl(viewModel.PlanName_Lbl);
            protoSelf.ESRDSituation_Lbl(viewModel.ESRDSituation_Lbl);
            protoSelf.ESRDSituation1_Lbl(viewModel.ESRDSituation1_Lbl);
            protoSelf.EGHPSituation1_Lbl(viewModel.EGHPSituation1_Lbl);
            protoSelf.ESRDSituation2_Lbl(viewModel.ESRDSituation2_Lbl);
            protoSelf.ESRDSituation3_Lbl(viewModel.ESRDSituation3_Lbl);
            protoSelf.ESRDQuestion_Lbl(viewModel.ESRDQuestion_Lbl);
            protoSelf.EGHPQuestion_Lbl(viewModel.EGHPQuestion_Lbl);
            protoSelf.Header(viewModel.Header);
            protoSelf.BackBtn(viewModel.BackBtn);
            protoSelf.ContinueBtn(viewModel.ContinueBtn);
            protoSelf.MoreHelpBtn(viewModel.MoreHelpBtn);
            protoSelf.HomeBtn(viewModel.HomeBtn);
            protoSelf.IsEGHP(viewModel.IsEGHP);
            protoSelf.Help_Lbl(viewModel.Help_Lbl);
            protoSelf.EGHPHelp_Lbl(viewModel.EGHPHelp_Lbl);
            protoSelf.ESRD_Id(viewModel.ESRD_Id);

            protoSelf.HasESRDSituation_radio(viewModel.HasESRDSituation_radio);

            if (viewModel.planModel != null) {
                var planModel = app.plans.PlanModel(viewModel.PlanModel);
                protoself.Plan(planModel);
            }

            return protoSelf;
        };
    };


} (EXCHANGE, this));