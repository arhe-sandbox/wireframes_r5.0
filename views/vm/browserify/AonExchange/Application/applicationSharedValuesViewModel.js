(function(app) {
    var ns = app.namespace("EXCHANGE.models");

    ns.ApplicationSharedValuesViewModel = function ApplicationSharedValuesViewModel() {
        if (!(this instanceof ApplicationSharedValuesViewModel)) {
            return new ApplicationSharedValuesViewModel();
        }
        var self = this;
        self.selectOne_lbl = ko.observable("");
        self.datePlaceholder_tip = ko.observable("");
        self.errorsHeader_lbl = ko.observable("");
        self.errorsBody_lbl = ko.observable("");

        self.showCompletionMessage = ko.computed({
            read: function() {
                if (!(app.viewModels && app.viewModels.ApplicationStateViewModel) || app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() === app.enums.ApplicationDisplayPageType.Review) {
                    return false;
                }
                return app.viewModels.ApplicationStateViewModel.ShowCompletedMessage();
            },
            owner: this
        });

        self.completedApplicationHdrTemplate = ko.observable("");
        self.completedApplicationDescTemplate = ko.observable("");

        self.completedApplication_hdr = ko.computed({
            read: function() {
                return self.completedApplicationHdrTemplate().format(app.viewModels.ApplicationStateViewModel.PreviousPlanTypeName());
            },
            owner: this,
            deferEvaluation: true
        });

        self.completedApplication_desc = ko.computed({
            read: function() {
                return self.completedApplicationDescTemplate().format(app.viewModels.ApplicationStateViewModel.CurrentPlanTypeName());
            },
            owner: this,
            deferEvaluation: true
        });

        self.thisIsTheApplicationForText = ko.observable('');

        ApplicationSharedValuesViewModel.prototype.loadFromJSON = function loadFromJSON(sharedValues) {
            var protoSelf = this;

            protoSelf.selectOne_lbl(sharedValues.SelectOne_Lbl);
            protoSelf.datePlaceholder_tip(sharedValues.DatePlaceholder_Tip);
            protoSelf.errorsHeader_lbl(sharedValues.ErrorsHeader_Lbl);
            protoSelf.errorsBody_lbl(sharedValues.ErrorsBody_Lbl);
            protoSelf.completedApplicationDescTemplate(sharedValues.CompletedApplicationDescTemplate);
            protoSelf.completedApplicationHdrTemplate(sharedValues.CompletedApplicationHdrTemplate);
            protoSelf.thisIsTheApplicationForText(sharedValues.ThisIsTheApplicationForText);

            return protoSelf;
        };

        return self;
    };
}(EXCHANGE));