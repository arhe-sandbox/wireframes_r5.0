(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.ApplicationEligibilityViewModel = function ApplicationEligibilityViewModel() {
        if (!(this instanceof ApplicationEligibilityViewModel)) {
            return new ApplicationEligibilityViewModel();
        }
        var self = this;

        self.whereToFind_lbl = ko.observable('');
        self.referTo_lbl = ko.observable('');

        ApplicationEligibilityViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.whereToFind_lbl(serverViewModel.WhereToFind_Lbl);
            protoself.referTo_lbl(serverViewModel.ReferTo_Lbl);

            return protoself;
        };

        return self;
    };


} (EXCHANGE));