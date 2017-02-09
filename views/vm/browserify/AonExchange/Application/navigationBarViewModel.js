(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.NavigationBarViewModel = function NavigationBarViewModel() {
        if (!(this instanceof NavigationBarViewModel)) {
            return new NavigationBarViewModel();
        }
        var self = this;

        self.backToCart_lbl = ko.observable('');
        self.goBack_lbl = ko.observable('');
        self.continue_lbl = ko.observable('');
        self.reviewApplication_lbl = ko.observable('');
        self.submitApplication_lbl = ko.observable('');
        self.overviewInfo_lbl = ko.observable('');
        self.applicationInfo_lbl = ko.observable('');
        self.reviewInfo_lbl = ko.observable('');
        self.backButtonHidden = ko.observable('');
        self.isLastApplicationPage = ko.observable('');

        self.barClass = ko.computed({
            read: function () {
                if (app.viewModels.ApplicationStateViewModel && app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review) {
                    return 'buttonbar2';
                }
                else {
                    return 'buttonbar';
                }
            },
            owner: this
        });

        self.goBackText = ko.computed({
            read: function () {
                if (app.viewModels.ApplicationStateViewModel && app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Overview) {
                    return self.backToCart_lbl();
                }
                else {
                    return self.goBack_lbl();
                }
            },
            owner: this
        });

        self.middleText = ko.computed({
            read: function () {
                if (app.viewModels.ApplicationStateViewModel && app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Overview) {
                    return self.overviewInfo_lbl();
                }
                else if (app.viewModels.ApplicationStateViewModel && app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Application) {
                    return self.applicationInfo_lbl();
                }
                else if (app.viewModels.ApplicationStateViewModel && app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review) {
                    return self.reviewInfo_lbl();
                }
                else {
                    return '';
                }
            },
            owner: this
        });

        self.continueClass = ko.computed({
            read: function () {
                if (app.viewModels.ApplicationStateViewModel) {
                    if ((app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review)
                        || (self.isLastApplicationPage())) {
                        return 'savebtnbig';
                    }
                }
                return 'checkoutbtn';
            },
            owner: this
        });

        self.continueText = ko.computed({
            read: function () {
                if (app.viewModels.ApplicationStateViewModel) {
                    if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review) {
                        return self.submitApplication_lbl();
                    } else if (self.isLastApplicationPage()) {
                        return self.reviewApplication_lbl();

                    } else {
                        return self.continue_lbl();
                    }
                } else {
                    return '';
                }
            },
            owner: this
            //deferEvaluation: true
        });

        self.continueDisplay = ko.computed({
            read: function() {
                if (app.viewModels.OverviewViewModel) {
                    return app.viewModels.OverviewViewModel.termsOfUseAccepted();
                }
                return true;
            },
            owner: this,
            deferEvaluation: true
        });


        NavigationBarViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.backToCart_lbl(serverViewModel.BackToCart_Lbl);
            protoself.goBack_lbl(serverViewModel.GoBack_Lbl);
            protoself.continue_lbl(serverViewModel.Continue_Lbl);
            protoself.reviewApplication_lbl(serverViewModel.ReviewApplication_Lbl);
            protoself.submitApplication_lbl(serverViewModel.SubmitApplication_Lbl);
            protoself.overviewInfo_lbl(serverViewModel.OverviewInfo_Lbl);
            protoself.applicationInfo_lbl(serverViewModel.ApplicationInfo_Lbl);
            protoself.reviewInfo_lbl(serverViewModel.ReviewInfo_Lbl);
            protoself.backButtonHidden(serverViewModel.BackButtonHidden);
            protoself.isLastApplicationPage(serverViewModel.IsLastApplicationPage);

            return protoself;
        };
    };

} (EXCHANGE));