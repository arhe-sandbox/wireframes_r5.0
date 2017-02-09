(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.MyActionNeededViewModel = function MyActionNeededViewModel() {
        if (!(this instanceof MyActionNeededViewModel)) {
            return new MyActionNeededViewModel();
        }
        var self = this;
        self.Alerts = ko.observableArray([]);

        self.NeedYourAttentionSingle_Lbl = ko.observable("");
        self.NeedYourAttentionPlural_Lbl = ko.observable("");
        self.ExpandAll_Lbl = ko.observable("");
        self.CollapseAll_Lbl = ko.observable("");
        self.New_Lbl = ko.observable("");
        self.No_Lbl = ko.observable("");
      //  self.Guided = ko.observable(false);     //False for ListView ; True for Guided Action
     //   self.GuidedAction = ko.observable(new EXCHANGE.models.MyGuidedActionViewModel());
        self.NewAlertsCount = ko.computed({
            read: function () {
                var count = self.NewAlerts().length;
                if (count === 0) {
                    return self.No_Lbl();
                }
                else {
                    return count;
                }
            },
            owner: this,
            deferEvaluation: true
        });

        self.NewAlerts = ko.computed({
            read: function () {
                var alerts = $.map(self.Alerts(), function (alert) {
                    if (alert.IsNew()) {
                        return alert;
                    }
                });

                return alerts;
            },
            owner: this
        });

        self.NeedYourAttention_Lbl = ko.computed({
            read: function () {
                if (self.NewAlertsCount() === 1) {
                    return self.NeedYourAttentionSingle_Lbl().format(self.NewAlertsCount());
                }
                return self.NeedYourAttentionPlural_Lbl().format(self.NewAlertsCount());
            },
            owner: this,
            deferEvalutaion: true
        });

        MyActionNeededViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;
            for (var i = 0; i < viewModel.Alerts.length; i++) {
                protoSelf.Alerts.push(ko.mapping.fromJS(viewModel.Alerts[i]));
            }
           
            protoSelf.New_Lbl(viewModel.New_Lbl);
            protoSelf.NeedYourAttentionSingle_Lbl(viewModel.NeedYourAttentionSingle_Lbl);
            protoSelf.NeedYourAttentionPlural_Lbl(viewModel.NeedYourAttentionPlural_Lbl);
            protoSelf.ExpandAll_Lbl(viewModel.ExpandAll_Lbl);
            protoSelf.CollapseAll_Lbl(viewModel.CollapseAll_Lbl);

            protoSelf.No_Lbl(viewModel.No_Lbl);
            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));