(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.HomeViewModel = function HomeViewModel() {
        if (!(this instanceof HomeViewModel)) {
            return new HomeViewModel();
        }
        var self = this;

        self.leftPanel_lbl = ko.observable("");
        self.zip_lbl = ko.observable("");
        self.zip_btnText = ko.observable("");

        self.topRightPanel_lbl = ko.observable("");
        self.bottomRightPanel_lbl = ko.observable("");

        self.alerts = ko.observableArray([]);
        self.alertSubjects = ko.computed({
            read: function() {
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

        HomeViewModel.prototype.LoadFromJSON = function LoadFromJSON(jsonHomeViewModel) {
            var protoSelf = this;
            protoSelf.leftPanel_lbl(jsonHomeViewModel.LeftPanel_Lbl);
            protoSelf.zip_lbl(jsonHomeViewModel.Zip_Lbl);
            protoSelf.zip_btnText(jsonHomeViewModel.ZipBtn_Text);

            protoSelf.topRightPanel_lbl(jsonHomeViewModel.TopRightPanel_Lbl);
            protoSelf.bottomRightPanel_lbl(jsonHomeViewModel.BottomRightPanel_Lbl);

            for (var i = 0; i < jsonHomeViewModel.Alerts.length; i++) {
                protoSelf.alerts.push(ko.mapping.fromJS(jsonHomeViewModel.Alerts[i]));
            }
            protoSelf.welcomeBack_lbl(jsonHomeViewModel.WelcomeBack_Lbl);
            protoSelf.needYourAttentionSingle_lbl(jsonHomeViewModel.NeedYourAttentionSingle_Lbl);
            protoSelf.needYourAttentionPlural_lbl(jsonHomeViewModel.NeedYourAttentionPlural_Lbl);
            protoSelf.showAll_lbl(jsonHomeViewModel.ShowAll_Lbl);

            return protoSelf;
        };
    };

} (EXCHANGE, this));
