(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.ApplicationIntegrityViewModel = function ApplicationIntegrityViewModel() {
        if (!(this instanceof ApplicationIntegrityViewModel)) {
            return new ApplicationIntegrityViewModel();
        }
        var self = this;

        self.isApplicationStateValid = ko.observable(true);
        self.applicationStateErrorMessage = ko.observable('');

        ApplicationIntegrityViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.isApplicationStateValid(serverViewModel.IsApplicationStateValid);
            protoself.applicationStateErrorMessage(serverViewModel.ApplicationStateErrorMessage);
            

            return protoself;
        };
    };

} (EXCHANGE));