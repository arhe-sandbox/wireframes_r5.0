(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.PartnerLandingViewModel = function PartnerLandingViewModel() {
        if (!(this instanceof PartnerLandingViewModel)) {
            return new PartnerLandingViewModel();
        }
        var self = this;

        self.leftPanel_lbl = ko.observable("");
        self.zip_lbl = ko.observable("");
        self.zip_btnText = ko.observable("");

        self.topRightPanel_lbl = ko.observable("");
        self.bottomRightPanel_lbl = ko.observable("");

        self.alerts = ko.observableArray([]);
        self.alertSubjects = ko.computed({
            read: function () {
                var alertSubjects = [];
                for (var i = 0; i < 2 && i < self.alerts().length; i++) {
                    alertSubjects.push(self.alerts()[i]);
                }

                return alertSubjects;
            },
            owner: this
        });
        self.welcomeBack_lbl = ko.observable("");
        self.needYourAttentionSingle_lbl = ko.observable("");
        self.needYourAttentionPlural_lbl = ko.observable("");
        self.needYourAttention_lbl = ko.computed({
            read: function () {
                var count = self.alerts().length;
                if (count > 1) {
                    return self.needYourAttentionPlural_lbl().format(self.alerts().length);
                }
                return self.needYourAttentionSingle_lbl().format(self.alerts().length);
            },
            owner: this,
            deferEvaluation: true
        });

        self.showAll_lbl = ko.observable("");

        PartnerLandingViewModel.prototype.LoadFromJSON = function LoadFromJSON(jsonPartnerLandingViewModel) {
            var protoSelf = this;
            protoSelf.leftPanel_lbl(jsonPartnerLandingViewModel.LeftPanel_Lbl);
            protoSelf.zip_lbl(jsonPartnerLandingViewModel.Zip_Lbl);
            protoSelf.zip_btnText(jsonPartnerLandingViewModel.ZipBtn_Text);

            protoSelf.topRightPanel_lbl(jsonPartnerLandingViewModel.TopRightPanel_Lbl);
            protoSelf.bottomRightPanel_lbl(jsonPartnerLandingViewModel.BottomRightPanel_Lbl);

            for (var i = 0; i < jsonPartnerLandingViewModel.Alerts.length; i++) {
                protoSelf.alerts.push(ko.mapping.fromJS(jsonPartnerLandingViewModel.Alerts[i]));
            }
            protoSelf.welcomeBack_lbl(jsonPartnerLandingViewModel.WelcomeBack_Lbl);
            protoSelf.needYourAttentionSingle_lbl(jsonPartnerLandingViewModel.NeedYourAttentionSingle_Lbl);
            protoSelf.needYourAttentionPlural_lbl(jsonPartnerLandingViewModel.NeedYourAttentionPlural_Lbl);
            protoSelf.showAll_lbl(jsonPartnerLandingViewModel.ShowAll_Lbl);

            return protoSelf;
        };
    };

} (EXCHANGE, this));
