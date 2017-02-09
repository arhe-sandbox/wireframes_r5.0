(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.FirstTimeUserViewModel = function FirstTimeUserViewModel() {
        if (!(this instanceof FirstTimeUserViewModel)) {
            return new FirstTimeUserViewModel();
        }
        var self = this;

        self.HeaderText = ko.observable("");
        self.BottomBarText = ko.observable("");
        self.ContinueText = ko.observable("");

        self.NoEmailWarningHeaderText = ko.observable('');
        self.NoEmailWarningBodyText = ko.observable('');
        self.ShowNoEmailWarning = ko.observable(false);

        self.RedirectToMyActionNeededFlag = false;

        self.FindAccountTemplateName = ko.observable('');

        FirstTimeUserViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoSelf = this;

            protoSelf.HeaderText(serverViewModel.HeaderText);
            protoSelf.BottomBarText(serverViewModel.BottomBarText);
            protoSelf.ContinueText(serverViewModel.ContinueText);
            protoSelf.NoEmailWarningHeaderText(serverViewModel.NoEmailWarningHeaderText);
            protoSelf.NoEmailWarningBodyText(serverViewModel.NoEmailWarningBodyText);

            return protoSelf;
        };
    };

} (EXCHANGE));
